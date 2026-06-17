// lib/actions/blog.actions.ts — Admin blog management
"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { slugify } from "@/lib/utils/slugify";

function requireAdmin(role?: string) {
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") throw new Error("Unauthorized");
}

function estimateReadTime(content: string): number {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const blogSchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  metaTitle: z.string().max(60).optional().nullable(),
  metaDesc: z.string().max(160).optional().nullable(),
  tags: z.string().optional(),
});

export type BlogActionResult = { success: boolean; error?: string; id?: string };

export async function createPostAction(formData: FormData): Promise<BlogActionResult> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = blogSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { tags, content, status, ...rest } = parsed.data;
  const slug = slugify(parsed.data.title);

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) return { success: false, error: "A post with this title already exists." };

  const post = await prisma.blogPost.create({
    data: {
      ...rest,
      slug,
      content,
      authorId: session!.user.id,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      readTimeMin: estimateReadTime(content),
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/blog");
  return { success: true, id: post.id };
}

export async function updatePostAction(id: string, formData: FormData): Promise<BlogActionResult> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);

  const raw = Object.fromEntries(formData.entries());
  const parsed = blogSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { tags, content, status, ...rest } = parsed.data;
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  await prisma.blogPost.update({
    where: { id },
    data: {
      ...rest,
      content,
      status,
      tags: tags ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      readTimeMin: estimateReadTime(content),
      publishedAt: status === "PUBLISHED" && !existing?.publishedAt ? new Date() : undefined,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing?.slug}`);
  revalidatePath("/admin/blog");
  return { success: true, id };
}

export async function deletePostAction(id: string): Promise<BlogActionResult> {
  const session = await auth();
  requireAdmin((session?.user as any)?.role);
  const post = await prisma.blogPost.findUnique({ where: { id } });
  await prisma.blogPost.update({ where: { id }, data: { status: "ARCHIVED" } });
  revalidatePath("/blog");
  revalidatePath(`/blog/${post?.slug}`);
  revalidatePath("/admin/blog");
  return { success: true };
}
