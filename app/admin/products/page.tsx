import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatPrice } from "@/lib/utils/currency";
import { Plus, Search, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminProductActions from "@/components/admin/AdminProductActions";

export const metadata: Metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const q = sp.q ?? "";
  const perPage = 20;

  const where: any = {
    ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{total} products total</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new"><Plus className="h-4 w-4" /> Add product</Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <form className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted-foreground)" }} />
          <input name="q" defaultValue={q} placeholder="Search by name or SKU…"
            className="pl-9 pr-4 py-2 rounded-lg border text-sm w-64 focus:outline-none"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)", color: "var(--color-foreground)" }} />
        </form>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Product", "Category", "Price", "Stock", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {products.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: "var(--color-muted-foreground)" }}>
                <Package className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No products found
              </td></tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5" style={{ color: "var(--color-muted-foreground)" }} />
                      <div>
                        <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                          {product.name}
                        </Link>
                        {product.sku && <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>SKU: {product.sku}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(Number(product.price))}</td>
                  <td className="px-4 py-3">
                    <span className={`font-semibold ${product.stock === 0 ? "text-red-500" : product.stock <= 10 ? "text-amber-500" : "text-green-600"}`}>
                      {product.stock}
                      {product.stock <= 10 && product.stock > 0 && <AlertTriangle className="h-3.5 w-3.5 inline ml-1" />}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdminProductActions productId={product.id} productName={product.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && <Link href={`/admin/products?page=${page - 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors" style={{ borderColor: "var(--color-border)" }}>Previous</Link>}
            {page < totalPages && <Link href={`/admin/products?page=${page + 1}&q=${q}`} className="px-3 py-1.5 rounded-lg border text-sm hover:bg-muted transition-colors" style={{ borderColor: "var(--color-border)" }}>Next</Link>}
          </div>
        </div>
      )}
    </div>
  );
}