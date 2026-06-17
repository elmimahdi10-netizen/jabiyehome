// app/admin/customers/[id]/page.tsx — Customer detail view
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";

export const metadata: Metadata = { title: "Customer — Admin" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { include: { items: true, payment: true }, orderBy: { createdAt: "desc" } },
      addresses: true,
      _count: { select: { orders: true, reviews: true } },
    },
  });
  if (!user) notFound();

  const ltv = (user.orders as any[]).reduce((s: number, o: any) => s + Number(o.total), 0);
  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700", PAYMENT_RECEIVED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-blue-100 text-blue-700", SHIPPED: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700", CANCELLED: "bg-red-100 text-red-700", REFUNDED: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/customers" className="hover:text-foreground">Customers</Link>
        <ChevronRight className="h-4 w-4" />
        <span>{user.name ?? user.email}</span>
      </nav>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: profile */}
        <div className="xl:col-span-1 space-y-4">
          <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3"
                style={{ background: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", color: "var(--color-cyan-500)" }}>
                {user.name?.charAt(0) ?? "?"}
              </div>
              <h2 className="font-bold text-lg">{user.name ?? "No name"}</h2>
              <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{user.email}</p>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Orders", value: user._count.orders },
                { label: "Reviews", value: user._count.reviews },
                { label: "LTV", value: formatPrice(ltv) },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg p-2" style={{ background: "var(--color-muted)" }}>
                  <p className="font-bold text-sm">{value}</p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{label}</p>
                </div>
              ))}
            </div>
            <div className="text-xs space-y-1" style={{ color: "var(--color-muted-foreground)" }}>
              <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
              <p>Role: <span className="font-medium capitalize">{user.role.toLowerCase()}</span></p>
              <p>Status: <span className={`font-medium ${user.isActive ? "text-green-600" : "text-red-500"}`}>{user.isActive ? "Active" : "Disabled"}</span></p>
            </div>
          </div>

          {/* Addresses */}
          {(user.addresses as any[]).length > 0 && (
            <div className="rounded-xl border p-5 space-y-3" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
              <h3 className="font-semibold text-sm">Saved addresses</h3>
              {(user.addresses as any[]).map((addr: any) => (
                <address key={addr.id} className="not-italic text-xs leading-relaxed p-2 rounded-lg"
                  style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                  {addr.firstName} {addr.lastName}<br />
                  {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                  {addr.city}, {addr.postalCode} {addr.country}
                </address>
              ))}
            </div>
          )}
        </div>

        {/* Right: order history */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
            <div className="px-5 py-4 border-b font-semibold" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
              Order history
            </div>
            <div style={{ background: "var(--color-card)" }}>
              {(user.orders as any[]).length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>No orders yet</p>
                </div>
              ) : (
                (user.orders as any[]).map((order: any, i: number) => (
                  <Link key={order.id} href={`/admin/orders/${order.id}`}
                    className={`flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors group ${i > 0 ? "border-t" : ""}`}
                    style={{ borderColor: "var(--color-border)" }}>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">#{order.orderNumber}</p>
                      <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? ""}`}>
                      {order.status.replace("_", " ")}
                    </span>
                    <span className="text-sm font-bold">{formatPrice(Number(order.total))}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
