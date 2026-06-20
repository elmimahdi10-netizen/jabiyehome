"use client";
import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const PRICE_RANGES = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 – $250", min: 100, max: 250 },
  { label: "$250 – $500", min: 250, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "Over $1,000", min: 1000, max: 99999 },
];

const BRANDS = [
  { id: "proshield", name: "ProShield" },
  { id: "smartguard", name: "SmartGuard" },
  { id: "nexlock", name: "NexLock" },
  { id: "visionpro", name: "VisionPro" },
  { id: "alarmsafe", name: "AlarmSafe" },
];

const RATINGS = [5, 4, 3];

interface FilterState {
  priceRange?: { min: number; max: number };
  brands: string[];
  minRating?: number;
  inStock: boolean;
}

interface ProductFiltersProps {
  className?: string;
}

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full py-3 text-sm font-semibold text-foreground hover:text-green-600 transition-colors"
      >
        {title}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="pb-4">{children}</div>}
    </div>
  );
}

export default function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    inStock: false,
  });

  const activeCount = [
    filters.priceRange,
    ...filters.brands,
    filters.minRating,
    filters.inStock,
  ].filter(Boolean).length;

  const clearAll = () =>
    setFilters({ brands: [], inStock: false });

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (filters.priceRange) {
      params.set("minPrice", String(filters.priceRange.min));
      params.set("maxPrice", String(filters.priceRange.max));
    } else {
      params.delete("minPrice");
      params.delete("maxPrice");
    }
    if (filters.brands.length) {
      params.set("brands", filters.brands.join(","));
    } else {
      params.delete("brands");
    }
    if (filters.minRating) {
      params.set("minRating", String(filters.minRating));
    } else {
      params.delete("minRating");
    }
    if (filters.inStock) {
      params.set("inStock", "true");
    } else {
      params.delete("inStock");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className={cn("space-y-0", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <Badge variant="cyan" className="text-xs px-1.5 py-0">
              {activeCount}
            </Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 transition-colors"
          >
            <X className="h-3 w-3" />
            Clear all
          </button>
        )}
      </div>

      {/* Price range */}
      <FilterSection title="Price range">
        <div className="space-y-1.5">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  priceRange:
                    f.priceRange?.min === range.min ? undefined : range,
                }))
              }
              className={cn(
                "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                filters.priceRange?.min === range.min
                  ? "bg-green-600/10 text-green-600 font-medium"
                  : "text-foreground/80 hover:bg-accent"
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      <FilterSection title="Brand">
        <div className="space-y-1.5">
          {BRANDS.map((brand) => (
            <label
              key={brand.id}
              className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.brands.includes(brand.id)}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    brands: e.target.checked
                      ? [...f.brands, brand.id]
                      : f.brands.filter((b) => b !== brand.id),
                  }))
                }
                className="h-4 w-4 rounded border-border accent-green-600"
              />
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                {brand.name}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum rating">
        <div className="space-y-1.5">
          {RATINGS.map((rating) => (
            <button
              key={rating}
              onClick={() =>
                setFilters((f) => ({
                  ...f,
                  minRating: f.minRating === rating ? undefined : rating,
                }))
              }
              className={cn(
                "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2",
                filters.minRating === rating
                  ? "bg-green-600/10 text-green-600 font-medium"
                  : "text-foreground/80 hover:bg-accent"
              )}
            >
              <span>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>
              <span>& up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* In stock */}
      <FilterSection title="Availability" defaultOpen={false}>
        <label className="flex items-center gap-2.5 px-1 py-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) =>
              setFilters((f) => ({ ...f, inStock: e.target.checked }))
            }
            className="h-4 w-4 rounded border-border accent-green-600"
          />
          <span className="text-sm text-foreground/80">In stock only</span>
        </label>
      </FilterSection>

      {/* Apply */}
      <div className="pt-4">
        <Button onClick={applyFilters} className="w-full" variant="glow" size="sm">
          Apply filters
        </Button>
      </div>
    </aside>
  );
}
