// components/admin/ProductForm.tsx — Create / edit product form (client)
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import ImageUploader, { type UploadedImage } from "./ImageUploader";
import { createProductAction, updateProductAction } from "@/lib/actions/product.actions";
import type { Product } from "@/types";

interface Category { id: string; name: string; slug: string }
interface Brand { id: string; name: string }

interface Props {
  product?: Product;
  categories: Category[];
  brands: Brand[];
}

export default function ProductForm({ product, categories, brands }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>(
    product?.images.map((img) => ({
      id: img.id,
      url: img.url,
      publicId: (img as any).publicId ?? "",
      altText: img.altText,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })) ?? []
  );

  const isEdit = !!product;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEdit
        ? await updateProductAction(product!.id, formData, images)
        : await createProductAction(formData, images);

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.push(`/admin/products/${result.productId}`);
    });
  };

  const fieldClass = "flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors";
  const fieldStyle = { borderColor: "var(--color-border)", background: "var(--color-background)", color: "var(--color-foreground)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left: main fields */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic info */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Product information</h2>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Product name *</label>
              <Input name="name" defaultValue={product?.name} required placeholder="e.g. ProShield 4K Outdoor Camera" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Short description</label>
              <Input name="shortDesc" defaultValue={product?.shortDesc} placeholder="One-line summary for cards" />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Full description *</label>
              <textarea name="description" defaultValue={product?.description} required rows={6}
                placeholder="Full product description…"
                className={`${fieldClass} h-auto resize-y`} style={fieldStyle} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">SKU</label>
                <Input name="sku" defaultValue={product?.sku} placeholder="PS-4K-001" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Tags (comma-separated)</label>
                <Input name="tags" defaultValue={product?.tags?.join(", ")} placeholder="4k, outdoor, ai" />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Pricing & inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Price (USD) *</label>
                <Input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required placeholder="249.99" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Sale price (USD)</label>
                <Input name="salePrice" type="number" step="0.01" min="0" defaultValue={product?.salePrice} placeholder="Leave blank for no sale" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Stock quantity *</label>
                <Input name="stock" type="number" min="0" defaultValue={product?.stock ?? 0} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Low stock alert at</label>
                <Input name="lowStockAlert" type="number" min="0" defaultValue={(product as any)?.lowStockAlert ?? 5} />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Product images</h2>
            <ImageUploader images={images} onChange={setImages} />
          </div>

          {/* SEO */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">SEO</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Meta title</label>
              <Input name="metaTitle" defaultValue={(product as any)?.metaTitle} placeholder="Defaults to product name" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Meta description</label>
              <textarea name="metaDesc" defaultValue={(product as any)?.metaDesc} rows={3}
                placeholder="160 character SEO description…"
                className={`${fieldClass} h-auto resize-y`} style={fieldStyle} />
            </div>
          </div>
        </div>

        {/* Right: sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Status</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isPublished" defaultChecked={product?.isPublished}
                className="h-4 w-4 rounded accent-cyan-500" />
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Visible in the storefront</p>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured}
                className="h-4 w-4 rounded accent-cyan-500" />
              <div>
                <p className="text-sm font-medium">Featured</p>
                <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Shown on homepage</p>
              </div>
            </label>
          </div>

          {/* Category */}
          <div className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Category *</h2>
            <select name="categoryId" required defaultValue={product?.categoryId}
              className={fieldClass} style={fieldStyle}>
              <option value="">Select category…</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Brand</h2>
            <select name="brandId" defaultValue={product?.brandId}
              className={fieldClass} style={fieldStyle}>
              <option value="">No brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {isEdit ? "Saving…" : "Creating…"}</>
            ) : (
              <><Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create product"}</>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
