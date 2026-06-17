// app/(store)/compare/page.tsx — Side-by-side product comparison table
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ComparePageClient from "@/components/compare/ComparePageClient";
import Link from "next/link";
import { BarChart2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Products",
  description: "Compare security cameras, alarm systems, and smart home products side by side.",
};

interface Props { searchParams: Promise<{ ids?: string }> }

export default async function ComparePage({ searchParams }: Props) {
  const sp = await searchParams;
  const ids = (sp.ids ?? "").split(",").filter(Boolean).slice(0, 4);

  if (ids.length < 2) {
    return (
      <div className="container py-24 text-center space-y-4">
        <BarChart2 className="h-12 w-12 mx-auto" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
        <h1 className="text-2xl font-bold">Product Comparison</h1>
        <p style={{ color: "var(--color-muted-foreground)" }}>
          Select at least 2 products to compare. Browse products and use the compare button on any product card.
        </p>
        <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
          style={{ color: "var(--color-cyan-500)" }}>
          Browse products →
        </Link>
      </div>
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, isPublished: true },
    include: { category: true, brand: true, images: { where: { isPrimary: true }, take: 1 }, variants: true },
  });

  // Preserve order from the ids param
  const ordered = ids
    .map((id) => (products as any[]).find((p) => p.id === id))
    .filter(Boolean);

  const serialised = ordered.map((p: any) => ({
    // Required Product fields
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description ?? "",
    shortDesc: p.shortDesc ?? undefined,
    price: Number(p.price),
    salePrice: p.salePrice ? Number(p.salePrice) : undefined,
    sku: p.sku ?? undefined,
    stock: p.stock,
    categoryId: p.categoryId,
    category: {
      id: p.category.id, name: p.category.name, slug: p.category.slug,
      depth: p.category.depth, sortOrder: p.category.sortOrder,
    },
    brandId: p.brandId ?? undefined,
    brand: p.brand ? { id: p.brand.id, name: p.brand.name, slug: p.brand.slug } : undefined,
    isFeatured: p.isFeatured,
    isPublished: p.isPublished,
    images: (p.images ?? []).map((i: any) => ({
      id: i.id, url: i.url, altText: i.altText ?? undefined, isPrimary: i.isPrimary, sortOrder: i.sortOrder,
    })),
    variants: (p.variants ?? []).map((v: any) => ({
      id: v.id, name: v.name, value: v.value, priceModifier: Number(v.priceModifier),
      stock: v.stock, sku: v.sku ?? undefined,
    })),
    tags: p.tags ?? [],
    specs: (p.specs as Record<string, string> | null) ?? undefined,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return <ComparePageClient products={serialised} />;
}
