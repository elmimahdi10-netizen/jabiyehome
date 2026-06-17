// app/admin/products/page.tsx — Admin product list with search, filter, pagination
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { deleteProductAction } from "@/lib/actions/product.actions";
import { Plus, Search, Package, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminProductActions from "@/components/admin/AdminProductActions";

export const metadata: Metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; page?: string; published?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const q = sp.q ?? "";
  const publishedFilter = sp.published;
  const perPage = 20;

  const where: any = {
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] }),
    ...(publishedFilter === "true" && { isPublished: true }),
    ...(publishedFilter === "false" && { isPublished: false }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true, brand: true, images: { where: { isPrimary: true }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{total} products total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new"><Plus className="h-4 w-4" /> Add product</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
          <input name="q" defaultValue={q} placeholder="Search by name or SKU…"
            className="pl-9 pr-4 py-2 rounded-lg border text-sm w-64 focus:outline-none focus:ring-2"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)", color: "var(--color-foreground)" }} />
        </form>
        <div className="flex items-center gap-2">
          {[
            { label: "All", value: "" },
            { label: "Published", value: "true" },
            { label: "Drafts", value: "false" },
          ].map(({ label, value }) => (
            <Link key={label} href={`/admin/products?published=${value}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${publishedFilter === value || (!publishedFilter && !value) ? "bg-cyan-500 text-[#0a1628]" : "bg-muted hover:bg-accent"}`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Product", "Category", "Price", "Stock", "Status", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {products.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12" style={{ color: "var(--color-muted-foreground)" }}>
                <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No products found
              </td></tr>
            ) : (
              (products as any[]).map((product) => {
                const img = product.images?.[0];
                return (
                  <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg overflow-hidden shrink-0"
                          style={{ background: "var(--color-muted)" }}>
                          {img ? (
                            <Image src={img.url} alt={product.name} width={40} height={40} className="object-cover w-full h-full" />
                          ) : (
                            <Package className="h-5 w-5 m-2.5" style={{ color: "var(--color-muted-foreground)" }} />
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline line-clamp-1"
                            style={{ color: "var(--color-foreground)" }}>
                            {product.name}
                          </Link>
                          {product.sku && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>SKU: {product.sku}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                      {product.category?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-medium">
                      {formatPrice(Number(product.salePrice ?? product.price))}
                      {product.salePrice && (
                        <span className="text-xs ml-1 line-through" style={{ color: "var(--color-muted-foreground)" }}>
                          {formatPrice(Number(product.price))}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-green-600"}`}>
                        {product.stock}
                        {product.stock <= 10 && product.stock > 0 && <AlertTriangle className="h-3.5 w-3.5 inline ml-1" />}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${product.isPublished ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                        {product.isPublished ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {product.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AdminProductActions productId={product.id} productName={product.name} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/products?page=${page - 1}&q=${q}`}
                className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors"
                style={{ borderColor: "var(--color-border)" }}>
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/products?page=${page + 1}&q=${q}`}
                className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors"
                style={{ borderColor: "var(--color-border)" }}>
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
