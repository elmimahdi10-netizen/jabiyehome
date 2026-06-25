// app/admin/orders/page.tsx — Admin order management
import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { ArrowRight, ShoppingCart } from "lucide-react";

export const metadata: Metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING:           { label: "Pending",          color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  PAYMENT_RECEIVED:  { label: "Paid",             color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  PROCESSING:        { label: "Processing",        color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  SHIPPED:           { label: "Shipped",           color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300" },
  DELIVERED:         { label: "Delivered",         color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  CANCELLED:         { label: "Cancelled",         color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
  REFUNDED:          { label: "Refunded",          color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

interface Props { searchParams: Promise<{ status?: string; page?: string }> }

export default async function AdminOrdersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const perPage = 25;
  const where: any = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } }, items: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{total} orders total</p>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[{ label: "All", value: "" }, ...Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({ label, value }))].map(({ label, value }) => (
          <Link key={value} href={`/admin/orders${value ? `?status=${value}` : ""}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === value || (!status && !value) ? "bg-cyan-500 text-[#0a1628]" : "bg-muted hover:bg-accent"}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Order", "Customer", "Items", "Status", "Total", "Date", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {orders.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12" style={{ color: "var(--color-muted-foreground)" }}>
                <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No orders found
              </td></tr>
            ) : (
              (orders as any[]).map((order) => {
                const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-semibold">#{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{order.user?.name ?? "Guest"}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center">{order.items?.length ?? 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${cfg.color}`}>{cfg.label}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(Number(order.total))}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors inline-flex"
                        style={{ color: "var(--color-muted-foreground)" }}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && <Link href={`/admin/orders?page=${page - 1}${status ? `&status=${status}` : ""}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted" style={{ borderColor: "var(--color-border)" }}>Previous</Link>}
            {page < totalPages && <Link href={`/admin/orders?page=${page + 1}${status ? `&status=${status}` : ""}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted" style={{ borderColor: "var(--color-border)" }}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}
