// components/checkout/CheckoutButton.tsx
"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/checkout.actions";
import { useCartStore } from "@/store/cart.store";

interface CheckoutButtonProps {
  size?: "default" | "lg" | "xl";
  className?: string;
}

export default function CheckoutButton({ size = "xl", className }: CheckoutButtonProps) {
  const { items } = useCartStore();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    if (!items.length) return;
    setError(null);

    startTransition(async () => {
      const result = await createCheckoutSession({
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = result.sessionUrl;
    });
  };

  return (
    <div className="space-y-2">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          {error}
        </div>
      )}
      <Button
        size={size}
        className={className}
        onClick={handleCheckout}
        disabled={isPending || !items.length}
      >
        {isPending ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Preparing checkout…</>
        ) : (
          <><ShoppingBag className="h-5 w-5" /> Checkout securely</>
        )}
      </Button>
    </div>
  );
}
