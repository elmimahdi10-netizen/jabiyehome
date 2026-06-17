import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import SortSelect from "@/components/product/SortSelect";
import Link from "next/link";
import ProductFilters from "@/components/product/ProductFilters";
import ProductGrid from "@/components/product/ProductGrid";
import Pagination from "@/components/common/Pagination";
import { Badge } from "@/components/ui/badge";
import type { Product, Category } from "@/types";

// Phase 3: replace with Prisma queries
const CATEGORY_MAP: Record<string, Category> = {
  cameras: {
    id: "cat-cameras",
    name: "Security Cameras",
    slug: "cameras",
    description:
      "Professional-grade indoor and outdoor security cameras. 4K resolution, AI-powered detection, colour night vision, and cloud storage.",
    depth: 0,
    sortOrder: 0,
    children: [
      { id: "c-indoor", name: "Indoor Cameras", slug: "cameras/indoor", depth: 1, sortOrder: 0 },
      { id: "c-outdoor", name: "Outdoor Cameras", slug: "cameras/outdoor", depth: 1, sortOrder: 1 },
      { id: "c-4k", name: "4K Cameras", slug: "cameras/4k", depth: 1, sortOrder: 2 },
      { id: "c-ai", name: "AI-Powered", slug: "cameras/ai-powered", depth: 1, sortOrder: 3 },
      { id: "c-wireless", name: "Wireless Cameras", slug: "cameras/wireless", depth: 1, sortOrder: 4 },
    ],
  },
  alarms: {
    id: "cat-alarms",
    name: "Alarm Systems",
    slug: "alarms",
    description:
      "Wireless, GSM, and smart alarm systems. Grade 2 certified, pet-friendly sensors, and optional 24/7 professional monitoring.",
    depth: 0,
    sortOrder: 0,
    children: [
      { id: "a-wireless", name: "Wireless Alarms", slug: "alarms/wireless", depth: 1, sortOrder: 0 },
      { id: "a-smart", name: "Smart Alarms", slug: "alarms/smart", depth: 1, sortOrder: 1 },
      { id: "a-gsm", name: "GSM Alarms", slug: "alarms/gsm", depth: 1, sortOrder: 2 },
    ],
  },
  "smart-home": {
    id: "cat-smart-home",
    name: "Smart Home",
    slug: "smart-home",
    description:
      "Smart locks, thermostats, lighting, hubs, and automation kits. Works with Matter, Alexa, Google Home, and Apple HomeKit.",
    depth: 0,
    sortOrder: 0,
    children: [
      { id: "sh-locks", name: "Smart Locks", slug: "smart-home/smart-locks", depth: 1, sortOrder: 0 },
      { id: "sh-therm", name: "Smart Thermostats", slug: "smart-home/smart-thermostats", depth: 1, sortOrder: 1 },
      { id: "sh-light", name: "Smart Lighting", slug: "smart-home/smart-lighting", depth: 1, sortOrder: 2 },
    ],
  },
  kits: {
    id: "cat-kits",
    name: "Security Kits",
    slug: "kits",
    description:
      "Complete home security bundles. Save up to 35% versus buying individually. Includes professional installation on orders over $299.",
    depth: 0,
    sortOrder: 0,
    children: [
      { id: "k-starter", name: "Starter Kits", slug: "kits/starter", depth: 1, sortOrder: 0 },
      { id: "k-family", name: "Family Kits", slug: "kits/family", depth: 1, sortOrder: 1 },
      { id: "k-premium", name: "Premium Kits", slug: "kits/premium", depth: 1, sortOrder: 2 },
    ],
  },
  sensors: {
    id: "cat-sensors",
    name: "Motion Sensors",
    slug: "sensors",
    description:
      "PIR, outdoor, AI-powered, and pet-friendly motion sensors. Pairs with any Jabiyehome alarm or camera system.",
    depth: 0,
    sortOrder: 0,
    children: [
      { id: "s-pir", name: "PIR Sensors", slug: "sensors/pir", depth: 1, sortOrder: 0 },
      { id: "s-outdoor", name: "Outdoor Sensors", slug: "sensors/outdoor-motion", depth: 1, sortOrder: 1 },
      { id: "s-pet", name: "Pet-Friendly", slug: "sensors/pet-friendly", depth: 1, sortOrder: 2 },
    ],
  },
};

function getMockProducts(categorySlug: string): Product[] {
  return Array.from({ length: 9 }, (_, i) => ({
    id: `${categorySlug}-${i}`,
    name: `${CATEGORY_MAP[categorySlug.split("/")[0]]?.name ?? "Product"} Model ${i + 1}`,
    slug: `${categorySlug}-product-${i + 1}`,
    description: "Premium security product.",
    price: 99.99 + i * 50,
    salePrice: i % 3 === 0 ? 79.99 + i * 40 : undefined,
    stock: i === 7 ? 0 : 20 - i,
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Security Cameras", slug: "cameras", depth: 0, sortOrder: 0 },
    isFeatured: i < 3,
    isPublished: true,
    images: [],
    variants: [],
    tags: [],
    avgRating: +(4.4 + Math.random() * 0.6).toFixed(1),
    reviewCount: 20 + i * 15,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

interface Props {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rootSlug = slug[0];
  const category = CATEGORY_MAP[rootSlug];
  if (!category) return {};
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const rootSlug = slug[0];
  const category = CATEGORY_MAP[rootSlug];
  if (!category) notFound();

  const subSlug = slug[1];
  const activeChild = category.children?.find((c) => c.slug === slug.join("/"));
  const displayCategory = activeChild ?? category;
  const page = parseInt(sp.page ?? "1");
  const products = getMockProducts(rootSlug);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        {subSlug ? (
          <>
            <Link href={`/category/${rootSlug}`} className="hover:text-foreground transition-colors">
              {category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">{displayCategory.name}</span>
          </>
        ) : (
          <span className="text-foreground font-medium">{category.name}</span>
        )}
      </nav>

      {/* Category header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-3">
          {displayCategory.name}
        </h1>
        {category.description && !subSlug && (
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Subcategory nav */}
      {category.children && !subSlug && (
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href={`/category/${rootSlug}`}
            className="px-4 py-2 rounded-full text-sm font-medium bg-cyan-500 text-[#0a1628]"
          >
            All {category.name}
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              href={`/category/${child.slug}`}
              className="px-4 py-2 rounded-full text-sm font-medium bg-muted hover:bg-accent text-foreground/80 hover:text-foreground transition-colors border border-border/60"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <Suspense fallback={<div className="w-56 shrink-0 animate-pulse bg-muted rounded-xl h-96" />}>
          <div className="hidden lg:block w-56 shrink-0">
            <ProductFilters />
          </div>
        </Suspense>

        {/* Main grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
            <p className="text-sm text-muted-foreground">
              {products.length} products
            </p>
            <select className="text-sm border border-border bg-background rounded-lg px-3 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="newest">Newest first</option>
              <option value="price_asc">Price: Low to high</option>
              <option value="price_desc">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>

          <ProductGrid products={products} />
          <Pagination currentPage={page} totalPages={4} />
        </div>
      </div>
    </div>
  );
}
