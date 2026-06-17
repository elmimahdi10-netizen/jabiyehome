// lib/actions/order.actions.ts — Admin order management server actions
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { refundOrder, updateOrderStatus } from "@/lib/services/order.service";
import { sendShippingConfirmation } from "@/lib/services/email.service";

type OrderStatus = "PENDING" | "PAYMENT_RECEIVED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

function requireAdmin(role?: string) {
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") throw new Error("Unauthorized");
}

export async function updateOrderStatusAction(
  orderId: string,
  status: OrderStatus,
  trackingNumber?: string,
  note?: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  await updateOrderStatus(orderId, status, note);

  if (status === "SHIPPED" && trackingNumber) {
    await prisma.order.update({ where: { id: orderId }, data: { trackingNumber } });

    // Send shipping email
    try {
      const order = await prisma.order.findUnique({ where: { id: orderId }, include: { user: true } });
      if (order && (order as any).user?.email) {
        await sendShippingConfirmation(
          (order as any).user.email,
          (order as any).orderNumber,
          trackingNumber,
          `https://track.example.com/${trackingNumber}`,
          "Within 3-5 business days"
        );
      }
    } catch (e) { console.error("Shipping email error:", e); }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function refundOrderAction(
  orderId: string,
  amount?: number
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  const result = await refundOrder(orderId, amount);
  if (result.success) {
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
  }
  return result;
}

export async function addOrderNoteAction(orderId: string, note: string): Promise<{ success: boolean }> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  await prisma.orderStatusHistory.create({
    data: { orderId, status: "PROCESSING", note: `[Admin note] ${note}` },
  });
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}
