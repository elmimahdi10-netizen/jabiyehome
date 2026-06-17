// app/(store)/account/wishlist/page.tsx
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getOrCreateWishlist } from "@/lib/services/wishlist.service";
import WishlistPageClient from "@/components/wishlist/WishlistPageClient";

export const metadata: Metadata = { title: "My Wishlist" };
export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  const wishlist = await getOrCreateWishlist(session!.user.id).catch(() => ({ id: "", items: [] }));

  // Serialise all Prisma Decimal/Date fields; cast to any to avoid incomplete shape errors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (wishlist.items as any[]).map((item) => ({
    id: item.id as string,
    addedAt: item.addedAt instanceof Date ? item.addedAt.toISOString() : String(item.addedAt),
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      description: item.product.description ?? "",
      shortDesc: item.product.shortDesc ?? undefined,
      price: Number(item.product.price),
      salePrice: item.product.salePrice ? Number(item.product.salePrice) : undefined,
      stock: item.product.stock,
      categoryId: item.product.categoryId,
      category: item.product.category,
      brand: item.product.brand ?? undefined,
      brandId: item.product.brandId ?? undefined,
      isFeatured: Boolean(item.product.isFeatured),
      isPublished: Boolean(item.product.isPublished),
      images: (item.product.images ?? []).map((img: any) => ({
        id: img.id, url: img.url, altText: img.altText ?? undefined,
        isPrimary: img.isPrimary, sortOrder: img.sortOrder,
      })),
      variants: (item.product.variants ?? []).map((v: any) => ({
        id: v.id, name: v.name, value: v.value,
        priceModifier: Number(v.priceModifier), stock: v.stock, sku: v.sku ?? undefined,
      })),
      tags: item.product.tags ?? [],
      specs: (item.product.specs as Record<string, string>) ?? undefined,
      createdAt: item.product.createdAt instanceof Date ? item.product.createdAt.toISOString() : String(item.product.createdAt),
      updatedAt: item.product.updatedAt instanceof Date ? item.product.updatedAt.toISOString() : String(item.product.updatedAt),
    },
  }));

  return <WishlistPageClient items={items} />;
}
