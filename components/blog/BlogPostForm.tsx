// components/blog/BlogPostForm.tsx — Blog post editor
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPostAction, updatePostAction } from "@/lib/actions/blog.actions";

interface Props {
  post?: {
    id: string; title: string; excerpt: string; content: string;
    coverImageUrl: string; status: string; tags: string;
    metaTitle: string; metaDesc: string;
  };
}

export default function BlogPostForm({ post }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isEdit = !!post;

  const fieldClass = "flex w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors";
  const fieldStyle = { borderColor: "var(--color-border)", background: "var(--color-background)", color: "var(--color-foreground)" };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = isEdit
        ? await updatePostAction(post!.id, formData)
        : await createPostAction(formData);

      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
        return;
      }
      router.push("/admin/blog");
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main editor */}
        <div className="xl:col-span-2 space-y-5">
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title *</label>
              <Input name="title" defaultValue={post?.title} required placeholder="e.g. How to choose the right security camera" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Excerpt</label>
              <textarea name="excerpt" defaultValue={post?.excerpt} rows={2}
                placeholder="Brief summary shown on the blog listing page (max 500 chars)…"
                className={`${fieldClass} h-auto resize-y`} style={fieldStyle} maxLength={500} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Content * (HTML)</label>
              <textarea name="content" defaultValue={post?.content} required rows={20}
                placeholder="Write your post content here. HTML is supported."
                className={`${fieldClass} h-auto resize-y font-mono text-xs`} style={fieldStyle} />
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                HTML is supported. Phase 6 will add a rich text editor. Reading time is estimated automatically.
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">SEO</h2>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Meta title <span className="text-xs font-normal" style={{ color: "var(--color-muted-foreground)" }}>(max 60 chars)</span></label>
              <Input name="metaTitle" defaultValue={post?.metaTitle} placeholder="Defaults to post title" maxLength={60} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Meta description <span className="text-xs font-normal" style={{ color: "var(--color-muted-foreground)" }}>(max 160 chars)</span></label>
              <textarea name="metaDesc" defaultValue={post?.metaDesc} rows={2}
                placeholder="Appears in Google search results…"
                className={`${fieldClass} h-auto resize-y`} style={fieldStyle} maxLength={160} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Status</h2>
            <select name="status" defaultValue={post?.status ?? "DRAFT"}
              className={`${fieldClass} w-full`} style={fieldStyle}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          {/* Cover image */}
          <div className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Cover image</h2>
            <Input name="coverImageUrl" type="url" defaultValue={post?.coverImageUrl}
              placeholder="https://..." />
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              Paste a Cloudinary URL or external image URL
            </p>
          </div>

          {/* Tags */}
          <div className="rounded-xl border p-5 space-y-3"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold">Tags</h2>
            <Input name="tags" defaultValue={post?.tags} placeholder="security, cameras, guides" />
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Comma-separated</p>
          </div>

          {/* Save */}
          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {isEdit ? "Saving…" : "Publishing…"}</>
            ) : (
              <><Save className="h-4 w-4" /> {isEdit ? "Save changes" : "Create post"}</>
            )}
          </Button>

          {post?.status === "PUBLISHED" && (
            <Button variant="outline" className="w-full" asChild>
              <a href={`/blog/${post.id}`} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4" /> Preview post
              </a>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
