// lib/actions/review.actions.ts — Review submission and moderation server actions
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasUserPurchasedProduct } from "@/lib/services/review.service";
import { approveReview, deleteReview } from "@/lib/services/review.service";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10, "Review must be at least 10 characters").max(2000),
});

export type ReviewActionResult = { success: boolean; error?: string };

export async function submitReviewAction(
  data: z.infer<typeof reviewSchema>
): Promise<ReviewActionResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "You must be signed in to leave a review." };
  }

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { productId, rating, title, body } = parsed.data;
  const userId = session.user.id;

  // Check product exists and is published
  const product = await prisma.product.findUnique({
    where: { id: productId, isPublished: true },
    select: { id: true, slug: true },
  });
  if (!product) return { success: false, error: "Product not found." };

  // One review per user per product
  const existing = await prisma.review.findUnique({
    where: { userId_productId: { userId, productId } },
  });
  if (existing) {
    return { success: false, error: "You have already reviewed this product. You can edit your existing review." };
  }

  // Determine if verified purchase
  const isVerified = await hasUserPurchasedProduct(userId, productId);

  await prisma.review.create({
    data: {
      userId,
      productId,
      rating,
      title: title || undefined,
      body,
      isVerified,
      // Auto-approve verified purchases; others go into moderation queue
      isApproved: isVerified,
    },
  });

  revalidatePath(`/products/${product.slug}`);
  return {
    success: true,
    error: isVerified
      ? undefined
      : "Your review has been submitted and is pending approval. Thank you!",
  };
}

export async function markReviewHelpfulAction(reviewId: string): Promise<ReviewActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Sign in to vote." };

  await prisma.review.update({
    where: { id: reviewId },
    data: { helpfulCount: { increment: 1 } },
  });
  return { success: true };
}

// ─── Admin actions ────────────────────────────────────────────────────────────

function requireAdmin(role?: string) {
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") throw new Error("Unauthorized");
}

export async function approveReviewAction(reviewId: string): Promise<ReviewActionResult> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  await approveReview(reviewId);
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function deleteReviewAction(reviewId: string): Promise<ReviewActionResult> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  await deleteReview(reviewId);
  revalidatePath("/admin/reviews");
  return { success: true };
}
