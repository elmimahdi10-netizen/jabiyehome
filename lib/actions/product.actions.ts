// lib/actions/product.actions.ts — Admin product management server actions
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
  shortDesc: z.string().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  lowStockAlert: z.coerce.number().int().min(0).default(5),
  categoryId: z.string().min(1),
  brandId: z.string().optional().nullable(),
  isFeatured: z.coerce.boolean().default(false),
  isPublished: z.coerce.boolean().default(false),
  tags: z.string().optional(),          // comma-separated
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
});

export type ProductFormState = { success: boolean; error?: string; productId?: string };

export async function createProductAction(formData: FormData, images: Array<{ url: string; publicId: string; isPrimary: boolean }>): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({ ...raw, isFeatured: raw.isFeatured === "on", isPublished: raw.isPublished === "on" });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { tags, ...data } = parsed.data;
  const slug = slugify(data.name);

  // Check slug uniqueness
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "A product with this name already exists. Choose a different name." };

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      salePrice: data.salePrice ?? undefined,
      publishedAt: data.isPublished ? new Date() : undefined,
      images: {
        create: images.map((img, i) => ({
          url: img.url,
          publicId: img.publicId,
          isPrimary: img.isPrimary,
          sortOrder: i,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return { success: true, productId: product.id };
}

export async function updateProductAction(id: string, formData: FormData, images: Array<{ id?: string; url: string; publicId: string; isPrimary: boolean }>): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({ ...raw, isFeatured: raw.isFeatured === "on", isPublished: raw.isPublished === "on" });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { tags, ...data } = parsed.data;

  await prisma.$transaction([
    prisma.product.update({
      where: { id },
      data: {
        ...data,
        tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
        salePrice: data.salePrice ?? null,
        publishedAt: data.isPublished ? new Date() : null,
      },
    }),
    // Replace images — delete then recreate
    prisma.productImage.deleteMany({ where: { productId: id } }),
  ]);

  if (images.length) {
    await prisma.productImage.createMany({
      data: images.map((img, i) => ({
        productId: id,
        url: img.url,
        isPrimary: img.isPrimary,
        sortOrder: i,
      })),
    });
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/products");
  return { success: true, productId: id };
}

export async function deleteProductAction(id: string): Promise<ProductFormState> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  // Soft delete — unpublish only (preserve order history)
  await prisma.product.update({ where: { id }, data: { isPublished: false } });
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
}
