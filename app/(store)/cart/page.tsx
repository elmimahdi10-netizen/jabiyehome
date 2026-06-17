// app/(store)/cart/page.tsx — Full cart page
import type { Metadata } from "next";
import CartPageClient from "@/components/checkout/CartPageClient";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your cart and proceed to checkout.",
};

export default function CartPage() {
  return <CartPageClient />;
}
