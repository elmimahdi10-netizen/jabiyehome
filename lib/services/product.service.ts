// lib/services/product.service.ts
import prisma from "@/lib/prisma";
import type { Product, ProductFilters, PaginatedResponse } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDesc: p.shortDesc ?? undefined,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    sku: p.sku ?? undefined,
    stock: p.stock,
    categoryId: p.categoryId,
    category: { id: p.category.id, name: p.category.name, slug: p.category.slug, depth: p.category.depth, sortOrder: p.category.sortOrder },
    brandId: p.brandId ?? undefined,
    brand: p.brand ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug } : undefined,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    images: (p.images ?? []).map((img: { id: string; url: string; altText?: string | null; sortOrder: number; isPrimary: boolean }) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? undefined,
      sortOrder: img.sortOrder,
      isPrimary: img.isPrimary,
    })),
    variants: (p.variants ?? []).map((v: { id: string; name: string; value: string; priceModifier: number | string; stock: number; sku?: string | null }) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      priceModifier: Number(v.priceModifier),
      stock: v.stock,
      sku: v.sku ?? undefined,
    })),
    tags: p.tags ?? [],
    specs: p.specs as Record<string, string> | undefined,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  };
}

const INCLUDE = {
  category: true,
  brand: true,
  images: { orderBy: { sortOrder: "asc" as const } },
  variants: true,
} as const;

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const { page = 1, perPage = 24, q, categorySlug, brandIds, minPrice, maxPrice, inStock, sortBy = "newest" } = filters;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    isPublished: true,
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }),
    ...(categorySlug && { OR: [{ category: { slug: categorySlug } }, { category: { parent: { slug: categorySlug } } }] }),
    ...(brandIds?.length && { brandId: { in: brandIds } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) },
    }),
    ...(inStock && { stock: { gt: 0 } }),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderBy: any =
    sortBy === "price_asc" ? { price: "asc" } :
    sortBy === "price_desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, include: INCLUDE, orderBy, skip: (page - 1) * perPage, take: perPage }),
    prisma.product.count({ where }),
  ]);

  return {
    data: (data as unknown as any[]).map(normalise),
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = await prisma.product.findUnique({ where: { slug, isPublished: true }, include: INCLUDE });
  return p ? normalise(p as unknown) : null;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { isFeatured: true, isPublished: true },
    include: INCLUDE,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  return (products as unknown as any[]).map(normalise);
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4): Promise<Product[]> {
  const products = await prisma.product.findMany({
    where: { categoryId, isPublished: true, id: { not: productId } },
    include: INCLUDE,
    take: limit,
    orderBy: { isFeatured: "desc" },
  });
  return (products as unknown as any[]).map(normalise);
}

// Admin
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createProduct(data: any): Promise<Product> {
  const p = await prisma.product.create({ data, include: INCLUDE });
  return normalise(p as unknown);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function updateProduct(id: string, data: any): Promise<Product> {
  const p = await prisma.product.update({ where: { id }, data, include: INCLUDE });
  return normalise(p as unknown);
}

export async function softDeleteProduct(id: string): Promise<void> {
  await prisma.product.update({ where: { id }, data: { isPublished: false } });
}
