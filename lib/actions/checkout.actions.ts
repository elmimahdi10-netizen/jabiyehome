"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { z } from "zod";
import type Stripe from "stripe";

const checkoutSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().positive().max(100),
  })).min(1),
  addressId: z.string().optional(),
  couponCode: z.string().optional(),
});

export type CheckoutActionResult =
  | { success: true; sessionUrl: string }
  | { success: false; error: string };

export async function createCheckoutSession(
  input: z.infer<typeof checkoutSchema>
): Promise<CheckoutActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "You must be signed in to checkout." };

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Invalid checkout data." };

  const { items, addressId, couponCode } = parsed.data;
  const userId = session.user.id;

  try {
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isPublished: true },
      include: { images: { where: { isPrimary: true }, take: 1 }, variants: true },
    });

    if (products.length !== productIds.length) {
      return { success: false, error: "One or more products are unavailable." };
    }

    // Validate stock
    for (const item of items) {
      const product = products.find((p: { id: string }) => p.id === item.productId)!;
      const variant = item.variantId
        ? product.variants.find((v: { id: string }) => v.id === item.variantId)
        : null;
      const stock = variant ? variant.stock : product.stock;
      if (stock < item.quantity) {
        return { success: false, error: `"${product.name}" only has ${stock} units in stock.` };
      }
    }

    // Validate coupon
    let couponDbId: string | null = null;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });
      if (!coupon || !coupon.isActive || (coupon.expiresAt && coupon.expiresAt < new Date()) || (coupon.maxUses && coupon.usedCount >= coupon.maxUses)) {
        return { success: false, error: "This coupon code is invalid or has expired." };
      }
      couponDbId = coupon.id;
    }

    // Build Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const product = products.find((p: { id: string }) => p.id === item.productId)!;
      const variant = item.variantId
        ? product.variants.find((v: { id: string }) => v.id === item.variantId)
        : null;
      const unitAmount = Math.round((Number(product.salePrice ?? product.price) + Number(variant?.priceModifier ?? 0)) * 100);
      const primaryImage = (product.images as Array<{ url: string }>)[0]?.url;

      return {
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: variant ? `${product.name} — ${variant.name}: ${variant.value}` : product.name,
            ...(primaryImage ? { images: [primaryImage] } : {}),
            metadata: { productId: product.id, variantId: variant?.id ?? "" },
          },
        },
        quantity: item.quantity,
      };
    });

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 0, currency: "usd" },
          display_name: "Free shipping",
          delivery_estimate: { minimum: { unit: "business_day", value: 5 }, maximum: { unit: "business_day", value: 10 } },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: 1499, currency: "usd" },
          display_name: "Express shipping (2-3 business days)",
          delivery_estimate: { minimum: { unit: "business_day", value: 2 }, maximum: { unit: "business_day", value: 3 } },
        },
      },
    ];

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US", "CA", "GB", "AU", "DE", "FR", "NL", "SE", "NO"] },
      shipping_options: shippingOptions,
      automatic_tax: { enabled: true },
      customer_email: session.user.email ?? undefined,
      allow_promotion_codes: true,
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
      metadata: {
        userId,
        addressId: addressId ?? "",
        couponId: couponDbId ?? "",
        items: JSON.stringify(items.map((i) => ({ productId: i.productId, variantId: i.variantId ?? null, quantity: i.quantity }))),
      },
      invoice_creation: { enabled: true },
    });

    if (!stripeSession.url) return { success: false, error: "Failed to create checkout session." };
    return { success: true, sessionUrl: stripeSession.url };
  } catch (err) {
    console.error("createCheckoutSession error:", err);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function verifyCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      amountTotal: session.amount_total,
      customerEmail: session.customer_details?.email,
    };
  } catch {
    return null;
  }
}
