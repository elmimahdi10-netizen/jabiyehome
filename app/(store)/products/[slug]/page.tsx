// app/(store)/products/[slug]/page.tsx — Product detail with session-aware wishlist + reviews
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ChevronRight, Truck, RotateCcw, Lock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartSection from "@/components/product/AddToCartSection";
import ProductTabs from "@/components/product/ProductTabs";
import WishlistButton from "@/components/wishlist/WishlistButton";
import { getProductBySlug, getRelatedProducts } from "@/lib/services/product.service";
import { isProductWishlisted } from "@/lib/services/wishlist.service";
import { formatPrice, calculateDiscount } from "@/lib/utils/currency";
import { buildProductJsonLd, buildBreadcrumbJsonLd } from "@/lib/utils/seo";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import { auth } from "@/lib/auth";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  if (!product) return {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://Jabiyehome.com";
  return {
    title: product.metaTitle ?? product.name,
    description: (product.metaDesc ?? product.shortDesc ?? product.description).slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDesc ?? product.description.slice(0, 160),
      images: product.images.filter((i) => i.isPrimary).map((i) => ({ url: i.url })),
      url: `${siteUrl}/products/${product.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDesc ?? "",
      images: product.images.filter((i) => i.isPrimary).map((i) => i.url),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const [product, session] = await Promise.all([
    getProductBySlug(slug).catch(() => null),
    auth().catch(() => null),
  ]);

  if (!product) notFound();

  const [related, wishlisted] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId, 4).catch(() => []),
    session?.user?.id ? isProductWishlisted(session.user.id, product.id).catch(() => false) : Promise.resolve(false),
  ]);

  const discount = product.salePrice ? calculateDiscount(product.price, product.salePrice) : null;
  const isSignedIn = !!session?.user;

  const productJsonLd = buildProductJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    price: product.price,
    salePrice: product.salePrice,
    stock: product.stock,
    images: product.images,
    brand: product.brand,
    sku: product.sku,
    avgRating: product.avgRating,
    reviewCount: product.reviewCount,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    ...(product.category ? [{ name: product.category.name, href: `/category/${product.category.slug}` }] : []),
    { name: product.name, href: `/products/${product.slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs mb-8"
          style={{ color: "var(--color-muted-foreground)" }}>
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
          {product.category && (
            <>
              <ChevronRight className="h-3 w-3" />
              <Link href={`/category/${product.category.slug}`} className="hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight className="h-3 w-3" />
          <span className="truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Gallery — sticky on desktop */}
          <div className="lg:sticky lg:top-24">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          <div className="space-y-6">
            {/* Brand + badges */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.brand && <Badge variant="outline">{product.brand.name}</Badge>}
              {product.isFeatured && <Badge variant="cyan">Featured</Badge>}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="destructive">Only {product.stock} left</Badge>
              )}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.avgRating != null && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={s <= Math.round(product.avgRating!) ? "text-amber-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm font-semibold">{product.avgRating}</span>
                <a href="#reviews" className="text-sm hover:underline"
                  style={{ color: "var(--color-muted-foreground)" }}>
                  {product.reviewCount} review{product.reviewCount !== 1 ? "s" : ""}
                </a>
                <span style={{ color: "var(--color-border)" }}>|</span>
                <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                  {product.stock > 5 ? "In stock" : product.stock > 0 ? `Only ${product.stock} left` : "Out of stock"}
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="font-display text-4xl font-bold">
                {formatPrice(product.salePrice ?? product.price)}
              </span>
              {product.salePrice && (
                <>
                  <span className="text-xl line-through" style={{ color: "var(--color-muted-foreground)" }}>
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="destructive" className="text-sm font-bold">−{discount}%</Badge>
                </>
              )}
            </div>

            <p style={{ color: "var(--color-muted-foreground)" }} className="leading-relaxed">
              {product.description}
            </p>

            <Separator />
            <AddToCartSection product={product} />

            {/* Wishlist button */}
            <div className="flex items-center gap-3">
              <WishlistButton
                productId={product.id}
                productSlug={product.slug}
                initialWishlisted={wishlisted}
                isSignedIn={isSignedIn}
                size="md"
              />
              <span className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                {wishlisted ? "Saved to wishlist" : "Save to wishlist"}
              </span>
            </div>

            <Separator />

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: Truck, label: "Free shipping", sub: "over $299" },
                { Icon: RotateCcw, label: "30-day returns", sub: "no questions" },
                { Icon: Lock, label: "Secure checkout", sub: "256-bit SSL" },
              ].map(({ Icon, label, sub }) => (
                <div key={label} className="text-center p-3 rounded-xl border"
                  style={{ borderColor: "var(--color-border)" }}>
                  <Icon className="h-5 w-5 mx-auto mb-1" style={{ color: "var(--color-cyan-500)" }} />
                  <p className="text-xs font-semibold">{label}</p>
                  <p className="text-[10px]" style={{ color: "var(--color-muted-foreground)" }}>{sub}</p>
                </div>
              ))}
            </div>

            {product.sku && (
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>SKU: {product.sku}</p>
            )}
          </div>
        </div>

        {/* Tabs: Description / Specs / Reviews */}
        <div className="mt-16" id="reviews">
          <Suspense fallback={<div className="animate-pulse h-96 rounded-2xl" style={{ background: "var(--color-muted)" }} />}>
            <ProductTabs product={product} isSignedIn={isSignedIn} />
          </Suspense>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-2xl font-bold mb-8">You may also like</h2>
            <FeaturedProducts products={related} />
          </div>
        )}
      </div>
    </>
  );
}
