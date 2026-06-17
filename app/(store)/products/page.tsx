// app/(store)/products/page.tsx — Real product listing with DB data
import type { Metadata } from "next";
import { Suspense } from "react";
import { LayoutGrid, List } from "lucide-react";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import SortSelect from "@/components/product/SortSelect";
import { getProducts } from "@/lib/services/product.service";
import type { ProductFilters as Filters } from "@/types";

export const metadata: Metadata = {
  title: "All Security Products",
  description: "Browse our complete range of home security cameras, alarm systems, smart locks, and security kits.",
};

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string; q?: string; minPrice?: string; maxPrice?: string;
    brands?: string; minRating?: string; inStock?: string; sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const sort = sp.sort ?? "newest";

  const filters: Filters = {
    page,
    perPage: 24,
    q: sp.q,
    minPrice: sp.minPrice ? parseFloat(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? parseFloat(sp.maxPrice) : undefined,
    brandIds: sp.brands ? sp.brands.split(",") : undefined,
    inStock: sp.inStock === "true",
    sortBy: sort as Filters["sortBy"],
  };

  const { data: products, meta } = await getProducts(filters).catch(() => ({
    data: [],
    meta: { total: 0, page: 1, perPage: 24, totalPages: 0 },
  }));

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">
          {sp.q ? `Results for "${sp.q}"` : "All Products"}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
          {meta.total} products
        </p>
      </div>

      <div className="flex gap-8">
        <Suspense fallback={<div className="w-56 shrink-0 animate-pulse rounded-xl h-96" style={{ background: "var(--color-muted)" }} />}>
          <div className="hidden lg:block w-56 shrink-0">
            <ProductFilters />
          </div>
        </Suspense>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
              Showing {products.length} of {meta.total}
            </p>
            <div className="flex items-center gap-3">
              <SortSelect defaultValue={sort} />
            </div>
          </div>

          <ProductGrid products={products} />
          <Pagination currentPage={meta.page} totalPages={meta.totalPages} />
        </div>
      </div>
    </div>
  );
}
