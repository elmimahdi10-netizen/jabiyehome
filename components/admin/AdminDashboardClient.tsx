// components/admin/AdminDashboardClient.tsx — Interactive admin dashboard
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  TrendingUp, ShoppingCart, Users, Package,
  ArrowRight, AlertTriangle, CheckCircle2, Clock,
  Truck, XCircle
} from "lucide-react";
import { formatPrice } from "@/lib/utils/currency";

interface Props {
  metrics: { revenue: number; orders: number; newCustomers: number };
  recentOrders: Array<{ id: string; orderNumber: string; status: string; total: number; itemCount: number; createdAt: string }>;
  lowStockProducts: Array<{ id: string; name: string; stock: number; sku?: string | null }>;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  PENDING:           { label: "Pending",          color: "text-amber-500",  Icon: Clock },
  PAYMENT_RECEIVED:  { label: "Paid",             color: "text-blue-500",   Icon: CheckCircle2 },
  PROCESSING:        { label: "Processing",        color: "text-blue-500",   Icon: Package },
  SHIPPED:           { label: "Shipped",           color: "text-purple-500", Icon: Truck },
  DELIVERED:         { label: "Delivered",         color: "text-green-500",  Icon: CheckCircle2 },
  CANCELLED:         { label: "Cancelled",         color: "text-red-500",    Icon: XCircle },
  REFUNDED:          { label: "Refunded",          color: "text-gray-500",   Icon: XCircle },
};

export default function AdminDashboardClient({ metrics, recentOrders, lowStockProducts }: Props) {
  const statCards = [
    { label: "Revenue (30d)", value: formatPrice(metrics.revenue), icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Orders (30d)", value: metrics.orders.toString(), icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "New customers (30d)", value: metrics.newCustomers.toString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Low stock alerts", value: lowStockProducts.length.toString(), icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          Last 30 days overview
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <motion.div key={card.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="rounded-xl border p-5"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <div className={`h-10 w-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="xl:col-span-2 rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Recent orders</h2>
            <Link href="/admin/orders" className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-cyan-500)" }}>
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div style={{ background: "var(--color-card)" }}>
            {recentOrders.length === 0 ? (
              <div className="py-12 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                No orders yet
              </div>
            ) : (
              recentOrders.map((order, i) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group ${i > 0 ? "border-t" : ""}`}
                    style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">#{order.orderNumber}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {new Date(order.createdAt).toLocaleDateString()} · {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
                      <cfg.Icon className="h-3.5 w-3.5" /> {cfg.label}
                    </div>
                    <span className="text-sm font-bold">{formatPrice(order.total)}</span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Low stock</h2>
            <Link href="/admin/products" className="text-xs font-medium flex items-center gap-1 hover:underline"
              style={{ color: "var(--color-cyan-500)" }}>
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div style={{ background: "var(--color-card)" }}>
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>All products in stock</p>
              </div>
            ) : (
              lowStockProducts.map((product, i) => (
                <Link key={product.id} href={`/admin/products/${product.id}`}
                  className={`flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--color-border)" }}>
                  <AlertTriangle className={`h-4 w-4 shrink-0 ${product.stock === 0 ? "text-red-500" : "text-amber-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    {product.sku && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>SKU: {product.sku}</p>}
                  </div>
                  <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-500" : "text-amber-500"}`}>
                    {product.stock}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
