// app/(store)/checkout/success/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import CheckoutSuccessClient from "@/components/checkout/CheckoutSuccessClient";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your order has been placed successfully.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutSuccessClient />
    </Suspense>
  );
}
