// components/compare/ComparePageClient.tsx — Comparison table UI
"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield, ShoppingCart, Check, Minus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/currency";
import type { Product } from "@/types";

interface Props { products: (Product & { specs?: Record<string, string> | null })[]; }

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className="px-5 py-4 text-sm align-top"
      style={{ background: highlight ? "color-mix(in srgb, var(--color-cyan-500) 4%, transparent)" : undefined }}>
      {children}
    </td>
  );
}

export default function ComparePageClient({ products }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  // Collect all spec keys across all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs ?? {})))
  );

  // Rows to compare (beyond specs)
  const featureRows: Array<{ label: string; key: keyof Product | string; format?: (val: any) => React.ReactNode }> = [
    { label: "Price", key: "price", format: (p: Product) => (
      <div>
        <span className="font-bold text-base">{formatPrice(p.salePrice ?? p.price)}</span>
        {p.salePrice && <span className="text-xs ml-1 line-through" style={{ color: "var(--color-muted-foreground)" }}>{formatPrice(p.price)}</span>}
      </div>
    )},
    { label: "Category", key: "category", format: (p: Product) => p.category?.name ?? "—" },
    { label: "Brand", key: "brand", format: (p: Product) => p.brand?.name ?? "—" },
    { label: "In stock", key: "stock", format: (p: Product) => (
      p.stock > 0
        ? <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><Check className="h-4 w-4" /> {p.stock > 5 ? "Yes" : `Only ${p.stock} left`}</span>
        : <span className="flex items-center gap-1 text-red-500"><X className="h-4 w-4" /> Out of stock</span>
    )},
    { label: "Featured", key: "isFeatured", format: (p: Product) => (
      p.isFeatured ? <Check className="h-4 w-4 text-cyan-500" /> : <Minus className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
    )},
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Comparing {products.length} products</h1>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
          <Link href="/products" className="hover:underline" style={{ color: "var(--color-cyan-500)" }}>
            ← Back to products
          </Link>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full min-w-[640px]" style={{ background: "var(--color-card)" }}>
          {/* Product headers */}
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--color-border)" }}>
              <th className="px-5 py-4 text-left text-sm font-semibold w-40"
                style={{ color: "var(--color-muted-foreground)", background: "var(--color-muted)" }}>
                Feature
              </th>
              {products.map((p) => {
                const img = p.images?.find((i) => i.isPrimary) ?? p.images?.[0];
                return (
                  <th key={p.id} className="px-5 py-4 text-left">
                    <div className="space-y-3">
                      <div className="h-20 w-20 rounded-xl overflow-hidden"
                        style={{ background: "var(--color-muted)" }}>
                        {img ? (
                          <Image src={img.url} alt={p.name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                          <Shield className="h-8 w-8 m-6" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
                        )}
                      </div>
                      <Link href={`/products/${p.slug}`}
                        className="text-sm font-semibold hover:underline block line-clamp-2">
                        {p.name}
                      </Link>
                      <Button size="sm" className="w-full" variant="navy"
                        disabled={p.stock === 0}
                        onClick={() => addItem(p as any)}>
                        <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
                      </Button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {/* Feature rows */}
            {featureRows.map(({ label, format }) => (
              <tr key={label}>
                <td className="px-5 py-4 text-sm font-medium"
                  style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                  {label}
                </td>
                {products.map((p, i) => (
                  <Cell key={p.id} highlight={i === 0}>
                    {format ? format(p) : "—"}
                  </Cell>
                ))}
              </tr>
            ))}

            {/* Spec rows */}
            {allSpecKeys.length > 0 && (
              <tr>
                <td colSpan={products.length + 1} className="px-5 py-3 text-xs font-bold uppercase tracking-wider"
                  style={{ background: "color-mix(in srgb, var(--color-cyan-500) 8%, transparent)", color: "var(--color-cyan-500)" }}>
                  Specifications
                </td>
              </tr>
            )}
            {allSpecKeys.map((key) => (
              <tr key={key}>
                <td className="px-5 py-3.5 text-sm font-medium"
                  style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                  {key}
                </td>
                {products.map((p) => (
                  <Cell key={p.id}>
                    <span className="text-sm">{p.specs?.[key] ?? <Minus className="h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />}</span>
                  </Cell>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
