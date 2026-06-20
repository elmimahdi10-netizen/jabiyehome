"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const navigateTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const pages = [];
  const delta = 2;
  const range = { start: Math.max(1, currentPage - delta), end: Math.min(totalPages, currentPage + delta) };

  if (range.start > 1) { pages.push(1); if (range.start > 2) pages.push("..."); }
  for (let i = range.start; i <= range.end; i++) pages.push(i);
  if (range.end < totalPages) { if (range.end < totalPages - 1) pages.push("..."); pages.push(totalPages); }

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-12" aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateTo(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground">…</span>
        ) : (
          <button
            key={page}
            onClick={() => navigateTo(page as number)}
            className={cn(
              "h-9 w-9 rounded-lg text-sm font-medium transition-colors",
              currentPage === page
                ? "bg-green-600 text-[#111827] font-bold"
                : "text-foreground/80 hover:bg-accent"
            )}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => navigateTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}
