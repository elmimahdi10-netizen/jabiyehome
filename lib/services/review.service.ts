// lib/services/review.service.ts
// Reviews: fetch, create, update (admin moderation), helpfulness voting.
import prisma from "@/lib/prisma";
import type { Review } from "@/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(r: any): Review & { isApproved: boolean; helpfulCount: number } {
  return {
    id: r.id,
    userId: r.userId,
    user: { name: r.user?.name ?? "Anonymous", avatarUrl: r.user?.avatarUrl ?? undefined },
    rating: r.rating,
    title: r.title ?? undefined,
    body: r.body,
    isVerified: r.isVerified,
    isApproved: r.isApproved,
    helpfulCount: r.helpfulCount,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  };
}

/** Public: only approved reviews */
export async function getProductReviews(
  productId: string,
  page = 1,
  perPage = 10
): Promise<{
  reviews: Array<Review & { isApproved: boolean; helpfulCount: number }>;
  total: number;
  avgRating: number;
  ratingDistribution: Record<number, number>;
}> {
  const where = { productId, isApproved: true };

  const [reviews, total, agg] = await Promise.all([
    prisma.review.findMany({
      where,
      include: { user: { select: { name: true, avatarUrl: true } } },
      orderBy: [{ helpfulCount: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.review.count({ where }),
    prisma.review.aggregate({ where, _avg: { rating: true }, _count: { rating: true } }),
  ]);

  // Rating distribution [1-5]
  const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const allRatings = await prisma.review.findMany({
    where,
    select: { rating: true },
  });
  for (const { rating } of allRatings as { rating: number }[]) {
    dist[rating] = (dist[rating] ?? 0) + 1;
  }

  return {
    reviews: (reviews as unknown as any[]).map(normalise),
    total,
    avgRating: Number((agg._avg.rating ?? 0).toFixed(1)),
    ratingDistribution: dist,
  };
}

/** Check if the current user has purchased this product (enables verified badge) */
export async function hasUserPurchasedProduct(
  userId: string,
  productId: string
): Promise<boolean> {
  const item = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: { in: ["DELIVERED", "SHIPPED"] },
      },
    },
  });
  return !!item;
}

/** Check if user already submitted a review for this product */
export async function getUserReviewForProduct(
  userId: string,
  productId: string
): Promise<(Review & { isApproved: boolean; helpfulCount: number }) | null> {
  const review = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
    include: { user: { select: { name: true, avatarUrl: true } } },
  });
  return review ? normalise(review as unknown) : null;
}

/** Admin: all reviews (approved + pending) */
export async function getAllReviews(
  page = 1,
  perPage = 25,
  filter: "all" | "pending" | "approved" = "all"
) {
  const where: any =
    filter === "pending" ? { isApproved: false } :
    filter === "approved" ? { isApproved: true } : {};

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.review.count({ where }),
  ]);

  return {
    data: reviews as unknown as any[],
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  };
}

/** Approve a review */
export async function approveReview(id: string): Promise<void> {
  await prisma.review.update({ where: { id }, data: { isApproved: true } });
  // Recompute product aggregate rating after approval
  await updateProductRating((await prisma.review.findUnique({ where: { id } }))!.productId);
}

/** Delete a review */
export async function deleteReview(id: string): Promise<void> {
  const review = await prisma.review.findUnique({ where: { id } });
  await prisma.review.delete({ where: { id } });
  if (review) await updateProductRating(review.productId);
}

/** Recompute and cache product avgRating — stored as JSON in product.specs for now */
async function updateProductRating(productId: string): Promise<void> {
  const agg = await prisma.review.aggregate({
    where: { productId, isApproved: true },
    _avg: { rating: true },
    _count: { rating: true },
  });
  // Note: product.avgRating is a virtual field computed on read in this architecture.
  // For true caching, run this after every approval to update a denormalised field.
  // The schema can be extended with avgRating: Float? if needed.
}
