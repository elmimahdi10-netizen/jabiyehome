// lib/stripe.ts — lazy Stripe client (safe during build without env vars)
import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set. Add it to your .env.local file.");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia", typescript: true });
  }
  return _stripe;
}

// Named export used throughout the codebase — lazily initialised
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as any)[prop];
  },
});
