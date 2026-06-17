// components/reviews/ReviewForm.tsx — Star-rating review submission form
"use client";

import { useState, useTransition } from "react";
import { Star, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitReviewAction } from "@/lib/actions/review.actions";
import { cn } from "@/lib/utils/cn";

const schema = z.object({
  rating: z.number().int().min(1, "Please select a rating").max(5),
  title: z.string().max(120).optional(),
  body: z.string().min(10, "Write at least 10 characters").max(2000),
});
type FormData = z.infer<typeof schema>;

interface Props {
  productId: string;
  productName: string;
  isSignedIn: boolean;
}

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

export default function ReviewForm({ productId, productName, isSignedIn }: Props) {
  const [hovered, setHovered] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });

  const rating = watch("rating");

  if (!isSignedIn) {
    return (
      <div className="rounded-xl border p-6 text-center"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
        <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
          <a href="/login" className="font-medium hover:underline" style={{ color: "var(--color-cyan-500)" }}>
            Sign in
          </a>{" "}
          to leave a review for {productName}.
        </p>
      </div>
    );
  }

  if (result?.success) {
    return (
      <div className="rounded-xl border p-6 flex items-start gap-4"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold">Review submitted</p>
          <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            {result.message || "Thank you for your review!"}
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const res = await submitReviewAction({ ...data, productId });
      if (res.success) {
        setResult({ success: true, message: res.error ?? "Thank you for your review!" });
      } else {
        setResult({ success: false, message: res.error ?? "Something went wrong." });
      }
    });
  };

  return (
    <div className="rounded-xl border p-6 space-y-5"
      style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
      <h3 className="font-semibold text-lg">Write a review</h3>

      {result && !result.success && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {result.message}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Star rating picker */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Your rating *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHovered(star)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setValue("rating", star, { shouldValidate: true })}
                className="transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    (hovered || rating) >= star
                      ? "fill-amber-400 text-amber-400"
                      : "text-gray-300 dark:text-gray-600"
                  )}
                />
              </button>
            ))}
            {(hovered || rating) > 0 && (
              <span className="ml-2 text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
                {RATING_LABELS[hovered || rating]}
              </span>
            )}
          </div>
          {errors.rating && (
            <p className="text-xs text-red-500">{errors.rating.message}</p>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Review title</label>
          <Input
            placeholder="Summarise your experience"
            maxLength={120}
            {...register("title")}
          />
        </div>

        {/* Body */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium">Your review *</label>
          <textarea
            rows={5}
            placeholder="What did you like or dislike? How is the product quality, installation, and app experience?"
            className="flex w-full rounded-lg border px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 transition-colors"
            style={{
              borderColor: "var(--color-border)",
              background: "var(--color-background)",
              color: "var(--color-foreground)",
              minHeight: "120px",
            }}
            {...register("body")}
          />
          {errors.body && (
            <p className="text-xs text-red-500">{errors.body.message}</p>
          )}
        </div>

        <Button type="submit" disabled={isPending || rating === 0}>
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</>
          ) : (
            "Submit review"
          )}
        </Button>

        <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
          Verified purchases are approved instantly. Other reviews are moderated within 24 hours.
        </p>
      </form>
    </div>
  );
}
