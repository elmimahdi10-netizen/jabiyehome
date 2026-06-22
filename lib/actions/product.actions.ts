// lib/actions/product.actions.ts — Admin product management server actions
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils/slugify";

function requireAdmin(role?: string) {
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new Error("Unauthorized: admin access required");
  }
}

const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().min(1),
  price: z.coerce.number().positive(),
  comparePrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  categoryId: z.string().min(1),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
});

export type ProductFormState = { success: boolean; error?: string; productId?: string };

export async function createProductAction(formData: FormData, images: string[]): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    featured: raw.featured === "on",
    active: raw.active === "on",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const slug = slugify(parsed.data.name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "A product with this name already exists." };

  const product = await prisma.product.create({
    data: {
      ...parsed.data,
      slug,
      images,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, productId: product.id };
}

export async function deleteProductAction(id: string): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  await prisma.product.update({ where: { id }, data: { active: false } });
  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true };
}

export async function updateStockAction(id: string, stock: number): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  await prisma.product.update({ where: { id }, data: { stock } });
  revalidatePath("/admin/products");
  return { success: true };
export async function updateProductAction(id: string, formData: FormData, images: string[]): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    featured: raw.featured === "on",
    active: raw.active === "on",
  });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      images,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  return { success: true, productId: id };
}}