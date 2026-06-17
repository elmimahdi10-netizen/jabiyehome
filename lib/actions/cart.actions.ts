// lib/actions/cart.actions.ts — Server-side cart operations
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * Merge a guest cart (Zustand localStorage) into the DB CartItem table on login.
 * Called once after NextAuth session is established.
 * The DB cart is the source-of-truth for webhook/order line items.
 */
export async function mergeGuestCart(
  guestItems: Array<{ productId: string; variantId?: string; quantity: number }>
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id || !guestItems.length) return;

  const userId = session.user.id;

  for (const item of guestItems) {
    try {
      await prisma.cartItem.upsert({
        where: {
          userId_productId_variantId: {
            userId,
            productId: item.productId,
            variantId: item.variantId ?? null,
          },
        },
        update: { quantity: { increment: item.quantity } },
        create: {
          userId,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        },
      });
    } catch {
      // Non-fatal: product may have been deleted, skip silently
    }
  }
}

/** Sync Zustand cart to DB (called periodically or on page load) */
export async function syncCartToDb(
  items: Array<{ productId: string; variantId?: string; quantity: number }>
): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  const userId = session.user.id;

  await prisma.$transaction(async (tx: any) => {
    // Clear existing DB cart for this user
    await tx.cartItem.deleteMany({ where: { userId } });
    // Rebuild from Zustand state
    if (items.length > 0) {
      await tx.cartItem.createMany({
        data: items.map((item) => ({
          userId,
          productId: item.productId,
          variantId: item.variantId ?? null,
          quantity: item.quantity,
        })),
        skipDuplicates: true,
      });
    }
  });
}

/** Clear server-side cart (called after successful order) */
export async function clearServerCart(): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;
  await prisma.cartItem.deleteMany({ where: { userId: session.user.id } });
}
