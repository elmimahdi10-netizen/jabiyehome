// components/reviews/ReviewList.tsx — Review display with rating distribution
"use client";

import { useState, useTransition } from "react";
import { Star, ThumbsUp, CheckCircle2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markReviewHelpfulAction } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils/cn";
import type { Review } from "@/types";

interface Props {
  reviews: Array<Review & { isApproved: boolean; helpfulCount: number }>;
  total: number;
  avgRating: number;
  ratingDistribution: Record<number, number>;
  productId: string;
  page: number;
  onPageChange: (page: number) => void;
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-4 text-right font-medium">{stars}</span>
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "var(--color-muted)" }}>
        <div className="h-full rounded-full bg-amber-400 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-xs" style={{ color: "var(--color-muted-foreground)" }}>{pct}%</span>
    </div>
  );
}

export default function ReviewList({
  reviews, total, avgRating, ratingDistribution, productId, page, onPageChange,
}: Props) {
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const handleHelpful = (reviewId: string) => {
    if (voted.has(reviewId)) return;
    startTransition(async () => {
      await markReviewHelpfulAction(reviewId);
      setVoted((prev) => new Set([...prev, reviewId]));
    });
  };

  const totalVotes = Object.values(ratingDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8" id="reviews">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 p-6 rounded-2xl"
        style={{ background: "var(--color-muted)" }}>
        <div className="text-center sm:border-r sm:pr-8" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-6xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            {avgRating > 0 ? avgRating.toFixed(1) : "—"}
          </p>
          <div className="flex items-center justify-center gap-0.5 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={cn("h-5 w-5", s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
            ))}
          </div>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{total} review{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex-1 space-y-2 justify-center flex flex-col">
          {[5, 4, 3, 2, 1].map((stars) => (
            <RatingBar key={stars} stars={stars} count={ratingDistribution[stars] ?? 0} total={totalVotes} />
          ))}
        </div>
      </div>

      {/* Individual reviews */}
      {reviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="font-semibold">No reviews yet</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
            Be the first to share your experience.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <article key={review.id} className="space-y-3 pb-6 border-b last:border-0" style={{ borderColor: "var(--color-border)" }}>
              {/* Author row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: "color-mix(in srgb, var(--color-green-600) 15%, transparent)", color: "var(--color-green-600)" }}>
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{review.user.name}</p>
                    {review.isVerified && (
                      <p className="text-xs flex items-center gap-1 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-3 w-3" /> Verified purchase
                      </p>
                    )}
                  </div>
                </div>
                <time className="text-xs shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
                  {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("h-4 w-4", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                ))}
              </div>

              {/* Content */}
              {review.title && <p className="font-semibold text-sm">{review.title}</p>}
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-muted-foreground)" }}>{review.body}</p>

              {/* Helpful */}
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={voted.has(review.id) || isPending}
                className={cn(
                  "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors",
                  voted.has(review.id)
                    ? "border-green-600/40 text-green-600"
                    : "border-border hover:border-green-600/40 hover:text-green-600"
                )}
                style={{ color: voted.has(review.id) ? "var(--color-green-600)" : "var(--color-muted-foreground)" }}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                Helpful{review.helpfulCount > 0 ? ` (${review.helpfulCount})` : ""}
              </button>
            </article>
          ))}
        </div>
      )}

      {/* Load more */}
      {total > reviews.length && (
        <div className="text-center">
          <Button variant="outline" onClick={() => onPageChange(page + 1)}>
            <ChevronDown className="h-4 w-4" /> Load more reviews
          </Button>
        </div>
      )}
    </div>
  );
}
