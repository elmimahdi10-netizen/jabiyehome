// app/admin/coupons/page.tsx — Coupon management
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { Plus, Tag, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Coupons — Admin" };
export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  PERCENTAGE: "% off",
  FIXED_AMOUNT: "$ off",
  FREE_SHIPPING: "Free shipping",
};

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button disabled title="Coupon creation UI coming soon">
          <Plus className="h-4 w-4" /> Create coupon
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Code", "Type", "Value", "Uses", "Active", "Expires"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {(coupons as any[]).length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16" style={{ color: "var(--color-muted-foreground)" }}>
                  <Tag className="h-10 w-10 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No coupons yet</p>
                  <p className="text-xs mt-1">Coupons are created and applied at checkout via Stripe promotion codes.</p>
                </td>
              </tr>
            ) : (
              (coupons as any[]).map((coupon) => (
                <tr key={coupon.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <code className="text-sm font-mono font-bold px-2 py-0.5 rounded"
                      style={{ background: "var(--color-muted)" }}>
                      {coupon.code}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-sm">{TYPE_LABELS[coupon.type]}</td>
                  <td className="px-4 py-3 font-semibold">
                    {coupon.type === "PERCENTAGE"
                      ? `${Number(coupon.value)}%`
                      : coupon.type === "FIXED_AMOUNT"
                      ? formatPrice(Number(coupon.value))
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {coupon.usedCount}
                    {coupon.maxUses ? ` / ${coupon.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3">
                    {coupon.isActive ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                    {coupon.expiresAt
                      ? new Date(coupon.expiresAt).toLocaleDateString()
                      : "Never"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stripe note */}
      <div className="rounded-xl border p-4 text-sm flex items-start gap-3"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)", color: "var(--color-muted-foreground)" }}>
        <Tag className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "var(--color-cyan-500)" }} />
        <p>
          Promotion codes entered at checkout are validated by Stripe. Coupon records here track usage for
          reporting and additional per-user limits. Create coupon codes in your{" "}
          <a href="https://dashboard.stripe.com/coupons" target="_blank" rel="noopener noreferrer"
            className="underline" style={{ color: "var(--color-cyan-500)" }}>
            Stripe dashboard
          </a>{" "}
          and sync the code here.
        </p>
      </div>
    </div>
  );
}
