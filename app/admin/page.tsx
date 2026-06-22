import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = { title: "Dashboard - Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [recentOrders, lowStock] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { stock: { lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, sku: true },
    }),
  ]);

  const metrics = { revenue: 0, orders: recentOrders.length, newCustomers: 0 };

  const serialiseOrder = (o: any) => ({
    id: o.id,
    orderNumber: o.id.slice(0, 8),
    status: o.status,
    total: Number(o.total),
    itemCount: o.items?.length ?? 0,
    paymentStatus: "PENDING",
    createdAt: o.createdAt.toISOString(),
  });

  return (
    <AdminDashboardClient
      metrics={metrics}
      recentOrders={recentOrders.map(serialiseOrder)}
      lowStockProducts={lowStock.map((p: any) => ({ ...p, stock: Number(p.stock) }))}
    />
  );
}
