// app/(store)/account/orders/[id]/page.tsx — Customer order detail
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getOrderById } from "@/lib/services/order.service";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package, Truck, Shield } from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = { title: "Order Details" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

const STATUS_STEPS = [
  { status: "PAYMENT_RECEIVED", label: "Order placed" },
  { status: "PROCESSING", label: "Processing" },
  { status: "SHIPPED", label: "Shipped" },
  { status: "DELIVERED", label: "Delivered" },
];

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const order = await getOrderById(id, session!.user.id).catch(() => null);
  if (!order) notFound();

  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/account/orders" className="hover:text-foreground">My Orders</Link>
        <ChevronRight className="h-3 w-3" />
        <span>#{order.orderNumber}</span>
      </nav>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Placed {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <span className="px-3 py-1.5 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          {order.status.replace("_", " ")}
        </span>
      </div>

      {/* Order progress */}
      {!["CANCELLED", "REFUNDED"].includes(order.status) && (
        <div className="rounded-xl border p-5" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const isDone = i <= currentStepIndex;
              const isCurrent = i === currentStepIndex;
              return (
                <div key={step.status} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${isDone ? "bg-cyan-500 text-[#0a1628]" : "border-2"}`}
                      style={!isDone ? { borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" } : {}}>
                      {isDone ? "✓" : i + 1}
                    </div>
                    <p className={`text-xs mt-1.5 text-center ${isCurrent ? "font-semibold" : ""}`}
                      style={{ color: isDone ? "var(--color-foreground)" : "var(--color-muted-foreground)" }}>
                      {step.label}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mb-5 transition-colors"
                      style={{ background: i < currentStepIndex ? "var(--color-cyan-500)" : "var(--color-border)" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <div className="px-5 py-4 font-semibold border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          Items ({order.items.length})
        </div>
        <div className="divide-y" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 px-5 py-4">
              <div className="h-16 w-16 rounded-xl overflow-hidden shrink-0" style={{ background: "var(--color-muted)" }}>
                {item.productSnapshot?.imageUrl ? (
                  <Image src={item.productSnapshot.imageUrl} alt={item.productSnapshot.name}
                    width={64} height={64} className="object-cover w-full h-full" />
                ) : (
                  <Package className="h-7 w-7 m-4.5" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{item.productSnapshot?.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                  {formatPrice(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-bold shrink-0">{formatPrice(item.totalPrice)}</p>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="px-5 py-4 space-y-2 border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          {[
            { label: "Subtotal", value: formatPrice(order.subtotal) },
            ...(order.discountAmount > 0 ? [{ label: "Discount", value: `−${formatPrice(order.discountAmount)}` }] : []),
            { label: "Shipping", value: order.shippingAmount === 0 ? "Free" : formatPrice(order.shippingAmount) },
            { label: "Tax", value: formatPrice(order.taxAmount) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span style={{ color: "var(--color-muted-foreground)" }}>{label}</span>
              <span>{value}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Trust */}
      <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-muted-foreground)" }}>
        <Shield className="h-4 w-4 text-green-500 shrink-0" />
        If you have questions, email{" "}
        <a href="mailto:support@Jabiyehome.com" className="hover:underline" style={{ color: "var(--color-cyan-500)" }}>
          support@Jabiyehome.com
        </a>
      </div>
    </div>
  );
}
