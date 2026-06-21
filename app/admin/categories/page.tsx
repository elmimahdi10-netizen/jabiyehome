// app/admin/categories/page.tsx
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import AdminCategoriesClient from "@/components/admin/AdminCategoriesClient";

export const metadata: Metadata = { title: "Categories – Admin" };
export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });
  return <AdminCategoriesClient categories={categories as any[]} />;
}