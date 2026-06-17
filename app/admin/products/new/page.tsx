import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "New Product — Admin" };

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
    prisma.brand.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/products" className="hover:text-foreground transition-colors">Products</Link>
        <ChevronRight className="h-4 w-4" />
        <span>New product</span>
      </nav>
      <h1 className="text-2xl font-bold">Add new product</h1>
      <ProductForm categories={categories as any[]} brands={brands as any[]} />
    </div>
  );
}
