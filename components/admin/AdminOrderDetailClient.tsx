// components/admin/AdminOrderDetailClient.tsx
"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, Package, CheckCircle2, AlertCircle, ExternalLink, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils/currency";
import { updateOrderStatusAction, refundOrderAction, addOrderNoteAction } from "@/lib/actions/order.actions";

type OrderStatus = "PENDING" | "PAYMENT_RECEIVED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

const STATUS_SEQUENCE: OrderStatus[] = ["PAYMENT_RECEIVED", "PROCESSING", "SHIPPED", "DELIVERED"];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending", PAYMENT_RECEIVED: "Payment received", PROCESSING: "Processing",
  SHIPPED: "Shipped", DELIVERED: "Delivered", CANCELLED: "Cancelled", REFUNDED: "Refunded",
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  PAYMENT_RECEIVED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  REFUNDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function AdminOrderDetailClient({ order }: { order: any }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [note, setNote] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [showRefund, setShowRefund] = useState(false);

  const canRefund = ["PAYMENT_RECEIVED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status) && order.payment?.status === "PAID";
  const currentIdx = STATUS_SEQUENCE.indexOf(order.status);
  const nextStatus = STATUS_SEQUENCE[currentIdx + 1];

  const advance = () => {
    if (!nextStatus) return;
    startTransition(async () => {
      const r = await updateOrderStatusAction(order.id, nextStatus, nextStatus === "SHIPPED" ? trackingNumber : undefined);
      setResult(r);
    });
  };

  const handleRefund = () => {
    startTransition(async () => {
      const amount = refundAmount ? parseFloat(refundAmount) : undefined;
      const r = await refundOrderAction(order.id, amount);
      setResult(r);
      if (r.success) setShowRefund(false);
    });
  };

  const addNote = () => {
    if (!note.trim()) return;
    startTransition(async () => {
      await addOrderNoteAction(order.id, note);
      setNote("");
    });
  };

  const card = "rounded-xl border p-5 space-y-4";
  const cardStyle = { borderColor: "var(--color-border)", background: "var(--color-card)" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Placed {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Result message */}
      {result && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm ${result.success ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"}`}>
          {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {result.success ? "Status updated successfully." : result.error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: order details */}
        <div className="xl:col-span-2 space-y-4">
          {/* Items */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Items ({order.items?.length})</h2>
            <div className="space-y-3">
              {(order.items ?? []).map((item: any) => {
                const img = item.product?.images?.[0];
                const snap = item.productSnapshot as { name: string; imageUrl?: string; sku?: string };
                return (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--color-muted)" }}>
                      {(img?.url || snap.imageUrl) && (
                        <Image src={img?.url ?? snap.imageUrl!} alt={snap.name} width={56} height={56} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{snap.name}</p>
                      {snap.sku && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>SKU: {snap.sku}</p>}
                      {item.variantSnapshot && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{(item.variantSnapshot as any).name}: {(item.variantSnapshot as any).value}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold">{formatPrice(item.totalPrice)}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{formatPrice(item.unitPrice)} × {item.quantity}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator />
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span style={{ color: "var(--color-muted-foreground)" }}>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
              {order.discountAmount > 0 && <div className="flex justify-between text-green-600 dark:text-green-400"><span>Discount</span><span>−{formatPrice(order.discountAmount)}</span></div>}
              <div className="flex justify-between"><span style={{ color: "var(--color-muted-foreground)" }}>Shipping</span><span>{order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount)}</span></div>
              <div className="flex justify-between"><span style={{ color: "var(--color-muted-foreground)" }}>Tax</span><span>{formatPrice(order.taxAmount)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            </div>
          </div>

          {/* Status history */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Order timeline</h2>
            <div className="space-y-3">
              {(order.statusHistory ?? []).map((h: any, i: number) => (
                <div key={h.id} className="flex items-start gap-3">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${STATUS_COLORS[h.status]}`}>
                    {(order.statusHistory.length - i)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{STATUS_LABELS[h.status]}</p>
                    {h.note && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{h.note}</p>}
                    <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                      {new Date(h.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Add note */}
            <div className="flex gap-2 mt-2">
              <input value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="Add internal note…"
                className="flex-1 h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }} />
              <Button size="sm" variant="outline" onClick={addNote} disabled={isPending || !note.trim()}>
                <MessageSquare className="h-4 w-4" /> Add
              </Button>
            </div>
          </div>
        </div>

        {/* Right: actions + info */}
        <div className="space-y-4">
          {/* Customer */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Customer</h2>
            <div>
              <p className="font-medium">{order.user?.name}</p>
              <a href={`mailto:${order.user?.email}`} className="text-sm hover:underline" style={{ color: "var(--color-green-600)" }}>
                {order.user?.email}
              </a>
              <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                Member since {new Date(order.user?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Link href={`/admin/customers/${order.user?.id}`}
              className="text-xs flex items-center gap-1 hover:underline" style={{ color: "var(--color-green-600)" }}>
              View customer <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Shipping address */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Shipping address</h2>
            <address className="not-italic text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>
              {order.address?.firstName} {order.address?.lastName}<br />
              {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}<br />
              {order.address?.city}, {order.address?.state} {order.address?.postalCode}<br />
              {order.address?.country}
            </address>
            {order.trackingNumber && (
              <p className="text-xs font-mono px-2 py-1 rounded" style={{ background: "var(--color-muted)" }}>
                Tracking: {order.trackingNumber}
              </p>
            )}
          </div>

          {/* Payment */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Payment</h2>
            <div className="text-sm space-y-1.5">
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted-foreground)" }}>Provider</span>
                <span className="font-medium">{order.payment?.provider ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted-foreground)" }}>Status</span>
                <span className="font-medium">{order.payment?.status ?? "—"}</span>
              </div>
              {order.payment?.paidAt && (
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-muted-foreground)" }}>Paid at</span>
                  <span className="font-medium">{new Date(order.payment.paidAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className={card} style={cardStyle}>
            <h2 className="font-semibold">Actions</h2>

            {nextStatus && (
              <div className="space-y-2">
                {nextStatus === "SHIPPED" && (
                  <input value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Tracking number (required for shipped)"
                    className="w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }} />
                )}
                <Button className="w-full" onClick={advance} disabled={isPending || (nextStatus === "SHIPPED" && !trackingNumber)}>
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Package className="h-4 w-4" />}
                  Mark as {STATUS_LABELS[nextStatus]}
                </Button>
              </div>
            )}

            {canRefund && (
              <div className="space-y-2">
                {showRefund ? (
                  <div className="space-y-2">
                    <input value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)}
                      type="number" step="0.01" placeholder={`Amount (max ${formatPrice(order.total)}) — blank for full refund`}
                      className="w-full h-9 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }} />
                    <div className="flex gap-2">
                      <Button variant="destructive" className="flex-1" onClick={handleRefund} disabled={isPending}>
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm refund"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowRefund(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                    onClick={() => setShowRefund(true)}>
                    Issue refund
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
