// app/api/webhooks/stripe/route.ts
// CRITICAL: All orders are created HERE — never in the checkout action itself.
// Stripe calls this endpoint after payment is confirmed server-side.
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "payment_intent.payment_failed":
        console.error("Payment failed:", (event.data.object as Stripe.PaymentIntent).id);
        break;
      case "charge.refunded":
        await handleRefund(event.data.object as Stripe.Charge);
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`Webhook handler error [${event.type}]:`, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const meta = session.metadata ?? {};
  const userId = meta.userId;
  if (!userId) throw new Error(`No userId in session metadata: ${session.id}`);

  // Idempotency guard
  const existing = await prisma.payment.findUnique({ where: { externalId: session.id } });
  if (existing) return;

  let items: Array<{ productId: string; variantId: string | null; quantity: number }> = [];
  try {
    items = JSON.parse(meta.items ?? "[]");
  } catch {
    throw new Error(`Invalid items in metadata: ${session.id}`);
  }

  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true },
  });

  // Build order items with price snapshot
  let subtotal = 0;
  const orderItemsData = items.map((item) => {
    const product = products.find((p: { id: string }) => p.id === item.productId)!;
    const variant = item.variantId
      ? product.variants.find((v: { id: string }) => v.id === item.variantId)
      : null;
    const unitPrice = Number(product.salePrice ?? product.price) + Number(variant?.priceModifier ?? 0);
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;
    return {
      productId: item.productId,
      quantity: item.quantity,
      unitPrice,
      totalPrice,
      productSnapshot: { name: product.name, sku: product.sku, imageUrl: (product.images as Array<{ url: string }>)[0]?.url ?? null },
      variantSnapshot: variant ? { id: variant.id, name: variant.name, value: variant.value } : null,
    };
  });

  const shippingAmount = (session.shipping_cost?.amount_total ?? 0) / 100;
  const taxAmount = (session.total_details?.amount_tax ?? 0) / 100;
  const total = (session.amount_total ?? 0) / 100;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await prisma.$transaction(async (tx: any) => {
    // Resolve shipping address
    let resolvedAddressId = meta.addressId || null;
    const sessionExpanded = session as Stripe.Checkout.Session & {
      shipping_details?: { name?: string; address?: Stripe.Address | null } | null;
    };

    if (!resolvedAddressId && sessionExpanded.shipping_details?.address) {
      const addr = sessionExpanded.shipping_details.address;
      const nameParts = (sessionExpanded.shipping_details.name ?? "Customer").split(" ");
      const dbAddr = await tx.address.create({
        data: {
          userId,
          firstName: nameParts[0] ?? "Customer",
          lastName: nameParts.slice(1).join(" ") || "",
          line1: addr.line1 ?? "",
          line2: addr.line2 ?? undefined,
          city: addr.city ?? "",
          state: addr.state ?? undefined,
          postalCode: addr.postal_code ?? "",
          country: addr.country ?? "US",
        },
      });
      resolvedAddressId = dbAddr.id;
    }

    if (!resolvedAddressId) {
      const placeholder = await tx.address.create({
        data: { userId, firstName: "Customer", lastName: "", line1: "Not provided", city: "", postalCode: "", country: "US" },
      });
      resolvedAddressId = placeholder.id;
    }

    const order = await tx.order.create({
      data: {
        userId,
        addressId: resolvedAddressId,
        couponId: meta.couponId || null,
        status: "PAYMENT_RECEIVED",
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount: 0,
        total,
        items: { create: orderItemsData.map((item) => ({ ...item, variantSnapshot: item.variantSnapshot ?? undefined })) },
        statusHistory: { create: { status: "PAYMENT_RECEIVED", note: `Stripe session: ${session.id}` } },
      },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        provider: "STRIPE",
        externalId: session.id,
        status: "PAID",
        amount: total,
        currency: (session.currency ?? "usd").toUpperCase(),
        paidAt: new Date(),
        metadata: { paymentIntentId: session.payment_intent as string },
      },
    });

    // Decrement stock
    for (const item of items) {
      if (item.variantId) {
        await tx.productVariant.update({ where: { id: item.variantId }, data: { stock: { decrement: item.quantity } } });
      } else {
        await tx.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
      }
    }

    await tx.cartItem.deleteMany({ where: { userId } });
    if (meta.couponId) {
      await tx.coupon.update({ where: { id: meta.couponId }, data: { usedCount: { increment: 1 } } });
    }

    // Fire-and-forget confirmation email
    setImmediate(async () => {
      try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.email) {
          const { sendOrderConfirmation } = await import("@/lib/services/email.service");
          await sendOrderConfirmation(user.email, order.orderNumber, orderItemsData.map((i) => ({ name: (i.productSnapshot as { name: string }).name, quantity: i.quantity, price: i.unitPrice })), total);
        }
      } catch (e) { console.error("Order email failed:", e); }
    });
  });
}

async function handleRefund(charge: Stripe.Charge) {
  const piId = charge.payment_intent as string;
  if (!piId) return;
  const sessions = await stripe.checkout.sessions.list({ payment_intent: piId, limit: 1 });
  const sessionId = sessions.data[0]?.id;
  if (!sessionId) return;
  const payment = await prisma.payment.findUnique({ where: { externalId: sessionId } });
  if (!payment) return;
  const refundAmount = charge.amount_refunded / 100;
  const isFull = charge.amount_refunded === charge.amount;
  await prisma.$transaction([
    prisma.payment.update({ where: { id: payment.id }, data: { status: isFull ? "REFUNDED" : "PARTIALLY_REFUNDED", refundedAt: new Date(), refundAmount } }),
    prisma.order.update({ where: { id: payment.orderId }, data: { status: isFull ? "REFUNDED" : "PROCESSING" } }),
    prisma.orderStatusHistory.create({ data: { orderId: payment.orderId, status: isFull ? "REFUNDED" : "PROCESSING", note: `Refund $${refundAmount.toFixed(2)}` } }),
  ]);
}
