import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { getProductBySlug } from "@/lib/services/product.service";

export const metadata: Metadata = { title: "Edit Product — Admin" };

interface Props { params: Promise<{ id: string }> }

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [productRaw, categories, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    Promise.resolve([]),
  ]);

  if (!productRaw) notFound();

  // Serialise for client
  const product: any = {
    ...productRaw,
    price: Number(productRaw.price),
    salePrice: productRaw.salePrice ? Number(productRaw.salePrice) : undefined,
    category: productRaw.category,
    brand: productRaw.brand,
    images: (productRaw.images as any[]).map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      publicId: img.publicId ?? "",
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
    variants: [],
    createdAt: productRaw.createdAt.toISOString(),
    updatedAt: productRaw.updatedAt.toISOString(),
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate max-w-48">{productRaw.name}</span>
      </nav>
      <div className="flex items-start justify-between">
        <h1 className="text-2xl font-bold">Edit product</h1>
        <Link href={`/products/${productRaw.slug}`} target="_blank"
          className="text-sm flex items-center gap-1 hover:underline"
          style={{ color: "var(--color-cyan-500)" }}>
          View on store ↗
        </Link>
      </div>
      <ProductForm product={product} categories={categories as any[]} brands={brands as any[]} />
    </div>
  );
}
