import { auth } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/services/order.service";
import { formatPrice } from "@/lib/utils/currency";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

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

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await auth();
  const orders = await getOrdersByUserId(session!.user.id).catch(() => []);

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border text-center py-24" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
        <Package className="h-14 w-14 mx-auto mb-4" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
        <h2 className="text-lg font-semibold mb-2">No orders yet</h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>Start building your security system today.</p>
        <Link href="/products" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: "var(--color-cyan-500)", color: "var(--color-navy-600)" }}>
          Browse products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Orders</h1>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        {orders.map((order, i) => (
          <Link key={order.id} href={`/account/orders/${order.id}`}
            className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group ${i > 0 ? "border-t" : ""}`}
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "color-mix(in srgb, var(--color-cyan-500) 10%, transparent)" }}>
              <Package className="h-5 w-5" style={{ color: "var(--color-cyan-500)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">Order #{order.orderNumber}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                {new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                {" · "}{order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
            <span className="text-base font-bold shrink-0">{formatPrice(order.total)}</span>
            <ArrowRight className="h-4 w-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-muted-foreground)" }} />
          </Link>
        ))}
      </div>
    </div>
  );
}
