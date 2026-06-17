// app/admin/page.tsx — Admin analytics dashboard
import type { Metadata } from "next";
import { getRevenueMetrics } from "@/lib/services/order.service";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = { title: "Dashboard — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // Parallel data fetch
  const [metrics, recentOrders, lowStock] = await Promise.allSettled([
    getRevenueMetrics(30),
    prisma.order.findMany({
      where: {},
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      where: { isPublished: true, stock: { lte: 10 } },
      orderBy: { stock: "asc" },
      take: 5,
      select: { id: true, name: true, stock: true, lowStockAlert: true, sku: true },
    }),
  ]);

  const metricsData = metrics.status === "fulfilled" ? metrics.value : { revenue: 0, orders: 0, newCustomers: 0 };
  const ordersData = recentOrders.status === "fulfilled" ? recentOrders.value : [];
  const stockData = lowStock.status === "fulfilled" ? lowStock.value : [];

  // Serialize Decimal/Date fields
  const serialiseOrder = (o: any) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    total: Number(o.total),
    itemCount: o.items?.length ?? 0,
    paymentStatus: o.payment?.status ?? "PENDING",
    createdAt: o.createdAt.toISOString(),
  });

  return (
    <AdminDashboardClient
      metrics={metricsData}
      recentOrders={ordersData.map(serialiseOrder)}
      lowStockProducts={stockData.map((p: any) => ({ ...p, stock: Number(p.stock) }))}
    />
  );
}
