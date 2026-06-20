// components/admin/AdminReviewsClient.tsx — Interactive review moderation
"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Star, CheckCircle2, Trash2, Loader2, Clock } from "lucide-react";
import { approveReviewAction, deleteReviewAction } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils/cn";

interface Props {
  reviews: any[];
  meta: { total: number; page: number; totalPages: number };
  filter: string;
}

export default function AdminReviewsClient({ reviews, meta, filter }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string) => {
    startTransition(async () => { await approveReviewAction(id); });
  };
  const handleDelete = (id: string) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    startTransition(async () => { await deleteReviewAction(id); });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reviews</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{meta.total} total</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
        ].map(({ label, value }) => (
          <Link key={value} href={`/admin/reviews?filter=${value}`}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              filter === value ? "bg-green-600 text-[#111827]" : "bg-muted hover:bg-accent"
            )}>
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        {reviews.length === 0 ? (
          <div className="py-16 text-center" style={{ background: "var(--color-card)" }}>
            <Star className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="font-semibold">No reviews</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            {reviews.map((review: any) => (
              <div key={review.id} className="p-5 flex gap-5">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={cn("h-4 w-4", s <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                      ))}
                    </div>
                    {review.isApproved ? (
                      <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
                        <Clock className="h-3.5 w-3.5" /> Pending
                      </span>
                    )}
                    {review.isVerified && (
                      <span className="text-xs text-green-600 dark:text-green-400">✓ Verified purchase</span>
                    )}
                  </div>

                  <div className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    <span className="font-medium">{review.user?.name}</span>
                    {" · "}{review.user?.email}
                    {" · "}
                    <Link href={`/products/${review.product?.slug}`}
                      className="hover:underline" style={{ color: "var(--color-green-600)" }}>
                      {review.product?.name}
                    </Link>
                    {" · "}{new Date(review.createdAt).toLocaleDateString()}
                  </div>

                  {review.title && <p className="font-semibold text-sm">{review.title}</p>}
                  <p className="text-sm leading-relaxed line-clamp-3" style={{ color: "var(--color-muted-foreground)" }}>
                    {review.body}
                  </p>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {!review.isApproved && (
                    <button onClick={() => handleApprove(review.id)} disabled={isPending}
                      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-green-500/10 text-green-700 dark:text-green-300 hover:bg-green-500/20">
                      {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(review.id)} disabled={isPending}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {meta.totalPages > 1 && (
        <div className="flex gap-2 justify-end">
          {meta.page > 1 && (
            <Link href={`/admin/reviews?filter=${filter}&page=${meta.page - 1}`}
              className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted"
              style={{ borderColor: "var(--color-border)" }}>
              Previous
            </Link>
          )}
          {meta.page < meta.totalPages && (
            <Link href={`/admin/reviews?filter=${filter}&page=${meta.page + 1}`}
              className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted"
              style={{ borderColor: "var(--color-border)" }}>
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
