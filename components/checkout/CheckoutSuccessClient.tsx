"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, Package, ArrowRight, Home, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { verifyCheckoutSession } from "@/lib/actions/checkout.actions";
import { formatPrice } from "@/lib/utils/currency";
import { useCartStore } from "@/store/cart.store";

export default function CheckoutSuccessClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const [status, setStatus] = useState<"loading" | "paid" | "unpaid" | "error">("loading");
  const [sessionData, setSessionData] = useState<{
    amountTotal: number | null;
    customerEmail: string | null;
  } | null>(null);

  useEffect(() => {
    if (!sessionId) { router.replace("/"); return; }

    clearCart();

    verifyCheckoutSession(sessionId).then((data) => {
      if (!data) { setStatus("error"); return; }
      setSessionData({ amountTotal: data.amountTotal, customerEmail: data.customerEmail ?? null });
      setStatus(data.status === "paid" ? "paid" : "unpaid");
    });
  }, [sessionId, clearCart, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto" style={{ color: "var(--color-green-600)" }} />
          <p style={{ color: "var(--color-muted-foreground)" }}>Confirming your order…</p>
        </div>
      </div>
    );
  }

  if (status === "error" || status === "unpaid") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm mx-auto px-4">
          <AlertCircle className="h-14 w-14 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Payment not confirmed</h1>
          <p style={{ color: "var(--color-muted-foreground)" }}>
            We couldn&apos;t confirm your payment. If you were charged, please contact support with your session ID: {sessionId}
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild><Link href="/cart">Return to cart</Link></Button>
            <Button variant="outline" asChild><Link href="/contact">Contact support</Link></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center py-16">
      <div className="max-w-lg w-full mx-auto px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring" }} className="text-center space-y-6">

          {/* Success icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 rounded-full animate-ping opacity-25"
              style={{ background: "var(--color-green-600)" }} />
            <div className="relative h-24 w-24 rounded-full flex items-center justify-center"
              style={{ background: "color-mix(in srgb, var(--color-green-600) 12%, transparent)", border: "2px solid color-mix(in srgb, var(--color-green-600) 30%, transparent)" }}>
              <CheckCircle2 className="h-12 w-12" style={{ color: "var(--color-green-600)" }} />
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">Order confirmed!</h1>
            <p style={{ color: "var(--color-muted-foreground)" }}>
              Thank you for your order. We&apos;ve sent a confirmation to{" "}
              <strong>{sessionData?.customerEmail ?? "your email"}</strong>.
            </p>
          </div>

          {sessionData?.amountTotal && (
            <div className="rounded-xl border p-5 text-sm"
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--color-muted-foreground)" }}>Total charged</span>
                <span className="text-xl font-bold">{formatPrice(sessionData.amountTotal / 100)}</span>
              </div>
            </div>
          )}

          {/* What's next */}
          <div className="rounded-xl border p-5 text-left space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <p className="text-sm font-semibold">What happens next</p>
            {[
              { step: "1", text: "You'll receive an order confirmation email shortly." },
              { step: "2", text: "Our team will process and dispatch your order within 1 business day." },
              { step: "3", text: "You'll receive a tracking link once your order ships." },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "color-mix(in srgb, var(--color-green-600) 12%, transparent)", color: "var(--color-green-600)" }}>
                  {step}
                </div>
                <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{text}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="flex-1">
              <Link href="/account/orders">
                <Package className="h-4 w-4" /> View my orders
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="flex-1">
              <Link href="/">
                <Home className="h-4 w-4" /> Continue shopping
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
