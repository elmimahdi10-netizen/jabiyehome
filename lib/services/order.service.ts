// lib/services/order.service.ts
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import type { Order } from "@/types";

type OrderStatus = "PENDING" | "PAYMENT_RECEIVED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normaliseOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    subtotal: Number(o.subtotal),
    discountAmount: Number(o.discountAmount),
    taxAmount: Number(o.taxAmount),
    shippingAmount: Number(o.shippingAmount),
    total: Number(o.total),
    items: (o.items ?? []).map((item: any) => ({
      id: item.id,
      productId: item.productId,
      productSnapshot: item.productSnapshot as { name: string; imageUrl: string },
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
      totalPrice: Number(item.totalPrice),
    })),
    createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
  };
}

const ORDER_INCLUDE = {
  items: { include: { product: { include: { images: { where: { isPrimary: true }, take: 1 } } } } },
  payment: true,
  address: true,
} as const;

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const orders = await prisma.order.findMany({ where: { userId }, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" } });
  return (orders as unknown as any[]).map(normaliseOrder);
}

export async function getOrderById(id: string, userId?: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({ where: { id }, include: ORDER_INCLUDE });
  if (!order) return null;
  if (userId && (order as any).userId !== userId) return null;
  return normaliseOrder(order as unknown);
}

export async function getAllOrders(page = 1, perPage = 25, status?: OrderStatus) {
  const where = status ? { status } : {};
  const [orders, total] = await Promise.all([
    prisma.order.findMany({ where, include: ORDER_INCLUDE, orderBy: { createdAt: "desc" }, skip: (page - 1) * perPage, take: perPage }),
    prisma.order.count({ where }),
  ]);
  return { data: (orders as unknown as any[]).map(normaliseOrder), meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, note?: string): Promise<void> {
  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        ...(status === "SHIPPED" && { shippedAt: new Date() }),
        ...(status === "DELIVERED" && { deliveredAt: new Date() }),
        ...(status === "CANCELLED" && { cancelledAt: new Date() }),
      },
    }),
    prisma.orderStatusHistory.create({ data: { orderId, status, note } }),
  ]);
}

export async function refundOrder(orderId: string, amount?: number): Promise<{ success: boolean; error?: string }> {
  const payment = await prisma.payment.findUnique({ where: { orderId } });
  if (!payment) return { success: false, error: "No payment found." };
  if ((payment as any).status === "REFUNDED") return { success: false, error: "Already fully refunded." };
  try {
    const session = await stripe.checkout.sessions.retrieve((payment as any).externalId);
    const paymentIntentId = session.payment_intent as string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const refundParams: any = { payment_intent: paymentIntentId };
    if (amount) refundParams.amount = Math.round(amount * 100);
    await stripe.refunds.create(refundParams);
    return { success: true };
  } catch (err) {
    console.error("Refund error:", err);
    return { success: false, error: "Stripe refund failed. Try again or refund in the Stripe dashboard." };
  }
}

export async function getRevenueMetrics(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [totalRevenue, orderCount, newCustomers] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "PAID", paidAt: { gte: since } }, _sum: { amount: true } }),
    prisma.order.count({ where: { status: { in: ["PAYMENT_RECEIVED", "PROCESSING", "SHIPPED", "DELIVERED"] }, createdAt: { gte: since } } }),
    prisma.user.count({ where: { role: "CUSTOMER", createdAt: { gte: since } } }),
  ]);
  return { revenue: Number(totalRevenue._sum.amount ?? 0), orders: orderCount, newCustomers };
}
