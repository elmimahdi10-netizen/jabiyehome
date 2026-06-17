import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import BlogPostForm from "@/components/blog/BlogPostForm";

export const metadata: Metadata = { title: "New Post — Admin" };

export default function NewBlogPostPage() {
  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1.5 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
        <Link href="/admin/blog" className="hover:text-foreground">Blog</Link>
        <ChevronRight className="h-4 w-4" />
        <span>New post</span>
      </nav>
      <h1 className="text-2xl font-bold">Write new post</h1>
      <BlogPostForm />
    </div>
  );
}
