// app/admin/orders/[id]/page.tsx — Admin order detail with status management
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import AdminOrderDetailClient from "@/components/admin/AdminOrderDetailClient";

export const metadata: Metadata = { title: "Order Detail — Admin" };
export const dynamic = "force-dynamic";

interface Props { params: Promise<{ id: string }> }

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, createdAt: true } },
      address: true,
      items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
      payment: true,
      statusHistory: { orderBy: { createdAt: "desc" } },
      coupon: true,
    },
  });

  if (!order) notFound();

  // Serialise all Decimal and Date fields for client
  const serialised = JSON.parse(JSON.stringify(order, (_, value) => {
    if (value && typeof value === "object" && "toFixed" in value) return Number(value);
    return value;
  }));

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/orders" className="hover:text-foreground transition-colors">Orders</Link>
        <ChevronRight className="h-4 w-4" />
        <span>#{order.orderNumber}</span>
      </nav>
      <AdminOrderDetailClient order={serialised} />
    </div>
  );
}
