// lib/utils/seo.ts — Reusable SEO utilities for JSON-LD structured data

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jabiyehome.com";

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Jabiyehome",
    url: SITE_URL,
    logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-555-1234",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://twitter.com/jabiyehome",
      "https://www.facebook.com/jabiyehome",
      "https://www.linkedin.com/company/jabiyehome",
    ],
  };
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Jabiyehome",
    description: "Professional home security and smart home systems",
    publisher: { "@id": `${SITE_URL}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildProductJsonLd(product: {
  name: string;
  description: string;
  slug: string;
  price: number;
  salePrice?: number;
  stock: number;
  images: Array<{ url: string; isPrimary: boolean }>;
  brand?: { name: string } | null;
  sku?: string;
  avgRating?: number;
  reviewCount?: number;
}) {
  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: `${SITE_URL}/products/${product.slug}`,
    sku: product.sku,
    ...(primaryImage ? { image: primaryImage.url } : {}),
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.price,
      priceCurrency: "USD",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/products/${product.slug}`,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
    ...(product.avgRating && product.reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.avgRating,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; href: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.href}`,
    })),
  };
}

export function buildArticleJsonLd(post: {
  title: string;
  excerpt?: string | null;
  slug: string;
  publishedAt?: string | null;
  updatedAt: string;
  coverImageUrl?: string | null;
  author?: { name: string } | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: { "@id": `${SITE_URL}/#organization` },
    ...(post.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };
}
