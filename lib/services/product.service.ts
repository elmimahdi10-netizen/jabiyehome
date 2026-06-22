import prisma from "@/lib/prisma";

function normalise(p: any) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    sku: p.sku ?? undefined,
    stock: p.stock,
    categoryId: p.categoryId,
    category: p.category ? { id: p.category.id, name: p.category.name, slug: p.category.slug } : undefined,
    featured: p.featured,
    active: p.active,
    images: (p.images ?? []).map((url, i) => ({ id: String(i), url, isPrimary: i === 0, altText: null, sortOrder: i })),
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  };
}

const INCLUDE = { category: true } as const;

export async function getProducts(filters: any = {}): Promise<any> {
  const { page = 1, perPage = 24, q, categorySlug, minPrice, maxPrice, inStock, sortBy = "newest" } = filters;
  const where: any = {
    active: true,
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }] }),
    ...(categorySlug && { category: { slug: categorySlug } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && { price: { ...(minPrice !== undefined && { gte: minPrice }), ...(maxPrice !== undefined && { lte: maxPrice }) } }),
    ...(inStock && { stock: { gt: 0 } }),
  };
  const orderBy: any = sortBy === "price_asc" ? { price: "asc" } : sortBy === "price_desc" ? { price: "desc" } : { createdAt: "desc" };
  const [data, total] = await Promise.all([
    prisma.product.findMany({ where, include: INCLUDE, orderBy, skip: (page - 1) * perPage, take: perPage }),
    prisma.product.count({ where }),
  ]);
  return { data: data.map(normalise), meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
}

export async function getProductBySlug(slug: string) {
  const p = await prisma.product.findUnique({ where: { slug }, include: INCLUDE });
  return p ? normalise(p) : null;
}

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({ where: { featured: true, active: true }, include: INCLUDE, take: limit, orderBy: { createdAt: "desc" } });
  return products.map(normalise);
}

export async function getRelatedProducts(productId: string, categoryId: string, limit = 4) {
  const products = await prisma.product.findMany({ where: { categoryId, active: true, id: { not: productId } }, include: INCLUDE, take: limit });
  return products.map(normalise);
}

export async function softDeleteProduct(id: string) {
  await prisma.product.update({ where: { id }, data: { active: false } });
}
