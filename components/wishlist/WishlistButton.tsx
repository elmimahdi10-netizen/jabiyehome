// components/wishlist/WishlistButton.tsx — Heart toggle for product pages and cards
"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";
import { toggleWishlistAction } from "@/lib/actions/wishlist.actions";
import { cn } from "@/lib/utils/cn";

interface Props {
  productId: string;
  productSlug: string;
  initialWishlisted?: boolean;
  isSignedIn?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export default function WishlistButton({
  productId,
  productSlug,
  initialWishlisted = false,
  isSignedIn = false,
  size = "md",
  className,
}: Props) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);
  const [isPending, startTransition] = useTransition();
  const [tooltip, setTooltip] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isSignedIn) {
      setTooltip("Sign in to save items");
      setTimeout(() => setTooltip(null), 2000);
      return;
    }

    startTransition(async () => {
      const result = await toggleWishlistAction(productId, productSlug);
      if (result.success) {
        setWishlisted(result.added ?? false);
      }
    });
  };

  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const buttonSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          buttonSize,
          "rounded-full flex items-center justify-center transition-all duration-200",
          "border hover:scale-110",
          wishlisted
            ? "border-rose-300 bg-rose-50 dark:border-rose-700 dark:bg-rose-950"
            : "border-border bg-background/80 hover:border-rose-300 hover:bg-rose-50 dark:hover:border-rose-700 dark:hover:bg-rose-950",
          className
        )}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={wishlisted}
      >
        {isPending ? (
          <Loader2 className={cn(iconSize, "animate-spin")} style={{ color: "var(--color-muted-foreground)" }} />
        ) : (
          <Heart
            className={cn(
              iconSize,
              "transition-colors",
              wishlisted ? "fill-rose-500 text-rose-500" : "text-gray-400"
            )}
          />
        )}
      </button>

      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap z-10"
          style={{ background: "var(--color-navy-600)" }}>
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent"
            style={{ borderTopColor: "var(--color-navy-600)" }} />
        </div>
      )}
    </div>
  );
}
