import type { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BlogPostForm from "@/components/blog/BlogPostForm";

export const metadata: Metadata = { title: "Edit Post — Admin" };

interface Props { params: Promise<{ id: string }> }

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const serialised = {
    id: post.id, title: post.title, slug: post.slug,
    excerpt: post.excerpt ?? "", content: post.content,
    coverImageUrl: post.coverImageUrl ?? "",
    status: post.status, tags: (post.tags as string[]).join(", "),
    metaTitle: post.metaTitle ?? "", metaDesc: post.metaDesc ?? "",
  };

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/blog" className="hover:text-foreground">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="truncate max-w-48">{post.title}</span>
      </nav>
      <h1 className="text-2xl font-bold">Edit post</h1>
      <BlogPostForm post={serialised} />
    </div>
  );
}
