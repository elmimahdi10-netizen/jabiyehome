// lib/services/wishlist.service.ts
import prisma from "@/lib/prisma";
import type { Product } from "@/types";

export async function getOrCreateWishlist(userId: string): Promise<{ id: string; items: any[] }> {
  let wishlist = await prisma.wishlist.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              brand: true,
              images: { where: { isPrimary: true }, take: 1 },
              variants: true,
            },
          },
        },
        orderBy: { addedAt: "desc" },
      },
    },
  });

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId, name: "My Wishlist" },
      include: { items: { include: { product: { include: { category: true, brand: true, images: true, variants: true } } } } },
    });
  }

  return wishlist as any;
}

export async function isProductWishlisted(userId: string, productId: string): Promise<boolean> {
  const wishlist = await prisma.wishlist.findFirst({ where: { userId }, select: { id: true } });
  if (!wishlist) return false;
  const item = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });
  return !!item;
}

export async function toggleWishlistItem(
  userId: string,
  productId: string
): Promise<{ added: boolean }> {
  const wishlist = await getOrCreateWishlist(userId);
  const existing = await prisma.wishlistItem.findUnique({
    where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    return { added: false };
  } else {
    await prisma.wishlistItem.create({
      data: { wishlistId: wishlist.id, productId },
    });
    return { added: true };
  }
}
