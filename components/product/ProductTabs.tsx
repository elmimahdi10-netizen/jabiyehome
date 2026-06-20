// components/product/ProductTabs.tsx — Description / Specs / Reviews tabs
// Reviews tab loads real data from the API and supports submission.
"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types";
import type { Review } from "@/types";
import ReviewList from "@/components/reviews/ReviewList";
import ReviewForm from "@/components/reviews/ReviewForm";

interface ProductTabsProps {
  product: Product;
  isSignedIn?: boolean;
}

interface ReviewData {
  reviews: Array<Review & { isApproved: boolean; helpfulCount: number }>;
  total: number;
  avgRating: number;
  ratingDistribution: Record<number, number>;
}

export default function ProductTabs({ product, isSignedIn = false }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [reviewPage, setReviewPage] = useState(1);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const loadReviews = useCallback(async (page: number) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`/api/v1/reviews?productId=${product.id}&page=${page}&perPage=10`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      if (page === 1) {
        setReviewData(data);
      } else {
        setReviewData((prev) => prev ? {
          ...data,
          reviews: [...prev.reviews, ...data.reviews],
        } : data);
      }
    } catch {
      // Non-fatal — reviews section stays empty
    } finally {
      setLoadingReviews(false);
    }
  }, [product.id]);

  useEffect(() => {
    if (activeTab === "reviews" && !reviewData) {
      loadReviews(1);
    }
  }, [activeTab, reviewData, loadReviews]);

  const handlePageChange = (page: number) => {
    setReviewPage(page);
    loadReviews(page);
  };

  const tabs = [
    { id: "description", label: "Description" },
    { id: "specs", label: "Specifications", hidden: !product.specs || Object.keys(product.specs).length === 0 },
    { id: "reviews", label: `Reviews${product.reviewCount ? ` (${product.reviewCount})` : ""}` },
  ].filter((t) => !t.hidden);

  return (
    <div>
      {/* Tab bar */}
      <div
        className="flex border-b overflow-x-auto"
        style={{ borderColor: "var(--color-border)" }}
        role="tablist"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors duration-150",
              activeTab === tab.id
                ? "border-green-600 text-green-600"
                : "border-transparent hover:text-foreground"
            )}
            style={{ color: activeTab === tab.id ? "var(--color-green-600)" : "var(--color-muted-foreground)" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-8" role="tabpanel">
        {/* ─── Description ─── */}
        {activeTab === "description" && (
          <div className="max-w-2xl space-y-4">
            <p className="leading-relaxed whitespace-pre-line" style={{ color: "var(--color-muted-foreground)" }}>
              {product.description}
            </p>
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full capitalize"
                    style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}
                  >
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Specifications ─── */}
        {activeTab === "specs" && product.specs && (
          <div className="max-w-xl">
            <dl className="divide-y rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              {Object.entries(product.specs).map(([key, value], i) => (
                <div
                  key={key}
                  className="flex items-start gap-4 px-5 py-3.5"
                  style={{ background: i % 2 === 0 ? "var(--color-muted)" : "var(--color-card)" }}
                >
                  <dt className="text-sm font-medium w-40 shrink-0" style={{ color: "var(--color-muted-foreground)" }}>
                    {key}
                  </dt>
                  <dd className="text-sm">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* ─── Reviews ─── */}
        {activeTab === "reviews" && (
          <div className="max-w-2xl space-y-8">
            {/* Submit form */}
            <ReviewForm
              productId={product.id}
              productName={product.name}
              isSignedIn={isSignedIn}
            />

            {/* Review list */}
            {loadingReviews && !reviewData ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 rounded w-1/4" style={{ background: "var(--color-muted)" }} />
                    <div className="h-3 rounded w-full" style={{ background: "var(--color-muted)" }} />
                    <div className="h-3 rounded w-3/4" style={{ background: "var(--color-muted)" }} />
                  </div>
                ))}
              </div>
            ) : reviewData ? (
              <ReviewList
                reviews={reviewData.reviews}
                total={reviewData.total}
                avgRating={reviewData.avgRating}
                ratingDistribution={reviewData.ratingDistribution}
                productId={product.id}
                page={reviewPage}
                onPageChange={handlePageChange}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
