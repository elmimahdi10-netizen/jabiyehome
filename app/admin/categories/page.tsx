// app/admin/categories/page.tsx — Category management
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = { title: "Categories — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true, children: true } }, parent: true },
    orderBy: [{ depth: "asc" }, { sortOrder: "asc" }],
  });
  return <AdminCategoriesClient categories={categories as any[]} />;
}
