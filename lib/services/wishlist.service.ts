import prisma from "@/lib/prisma";

export async function getOrCreateWishlist(userId: string) {
  const items = await prisma.wishlistItem.findMany({
    where: { userId },
    include: { product: { include: { category: true } } },
    orderBy: { createdAt: "desc" },
  });
  return { id: userId, items };
}

export async function isProductWishlisted(userId: string, productId: string): Promise<boolean> {
  try {
    const item = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    return !!item;
  } catch {
    return false;
  }
}

export async function toggleWishlistItem(userId: string, productId: string): Promise<{ added: boolean }> {
  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    await prisma.wishlistItem.delete({ where: { userId_productId: { userId, productId } } });
    return { added: false };
  } else {
    await prisma.wishlistItem.create({ data: { userId, productId } });
    return { added: true };
  }
}
