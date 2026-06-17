import { auth } from "@/lib/auth";
import { getOrdersByUserId } from "@/lib/services/order.service";
import { Package, Heart, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils/currency";

export default async function AccountDashboard() {
  const session = await auth();
  const orders = await getOrdersByUserId(session!.user.id).catch(() => []);
  const recentOrders = orders.slice(0, 3);

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    PAYMENT_RECEIVED: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    PROCESSING: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    SHIPPED: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    DELIVERED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    REFUNDED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session!.user.name?.split(" ")[0]}</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Manage your orders, wishlist, and account settings
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total orders", value: orders.length, Icon: Package, href: "/account/orders" },
          { label: "Wishlist items", value: "—", Icon: Heart, href: "/account/wishlist" },
          { label: "Saved addresses", value: "—", Icon: MapPin, href: "/account/addresses" },
        ].map(({ label, value, Icon, href }) => (
          <Link key={label} href={href}
            className="rounded-xl border p-4 hover:border-cyan-500/40 transition-colors group"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <Icon className="h-5 w-5 mb-2" style={{ color: "var(--color-cyan-500)" }} />
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{label}</div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/account/orders" className="text-xs font-medium flex items-center gap-1 hover:underline" style={{ color: "var(--color-cyan-500)" }}>
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center" style={{ background: "var(--color-card)" }}>
            <Package className="h-10 w-10 mx-auto mb-3" style={{ color: "var(--color-muted-foreground)", opacity: 0.4 }} />
            <p className="text-sm font-medium">No orders yet</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-muted-foreground)" }}>Your orders will appear here once you make a purchase.</p>
          </div>
        ) : (
          recentOrders.map((order, i) => (
            <Link key={order.id} href={`/account/orders/${order.id}`}
              className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group ${i > 0 ? "border-t" : ""}`}
              style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">#{order.orderNumber}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                  {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                {order.status.replace("_", " ")}
              </span>
              <span className="text-sm font-bold">{formatPrice(order.total)}</span>
              <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-muted-foreground)" }} />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
