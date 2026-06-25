import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if (session.payment_status !== "paid") return NextResponse.json({ received: true });

    const meta = session.metadata ?? {};
    const userId = meta.userId;
    if (!userId) return NextResponse.json({ error: "No userId" }, { status: 400 });

    let items: Array<{ productId: string; quantity: number }> = [];
    try { items = JSON.parse(meta.items ?? "[]"); } catch { items = []; }

    const products = await prisma.product.findMany({ where: { id: { in: items.map((i) => i.productId) } } });

    const total = (session.amount_total ?? 0) / 100;

    const order = await prisma.order.create({
      data: {
        userId,
        status: "PROCESSING",
        subtotal: total,
        total,
        tax: (session.total_details?.amount_tax ?? 0) / 100,
        shipping: (session.shipping_cost?.amount_total ?? 0) / 100,
        stripePaymentId: session.id,
        shippingAddress: session.shipping_details?.address ?? {},
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: Number(product?.price ?? 0),
            };
          }),
        },
      },
    });

    for (const item of items) {
      await prisma.product.update({ where: { id: item.productId }, data: { stock: { decrement: item.quantity } } });
    }

    console.log("Order created:", order.id);
  }

  return NextResponse.json({ received: true });
}
