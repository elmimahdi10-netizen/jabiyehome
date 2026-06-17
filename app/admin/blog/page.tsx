// app/admin/blog/page.tsx — Admin blog management
import type { Metadata } from "next";
import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/services/blog.service";
import { deletePostAction } from "@/lib/actions/blog.actions";
import { Plus, Edit2, Eye, EyeOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Blog — Admin" };
export const dynamic = "force-dynamic";

interface Props { searchParams: Promise<{ status?: string; page?: string }> }

export default async function AdminBlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = sp.status;
  const page = parseInt(sp.page ?? "1");

  const { posts, meta } = await getAllPostsAdmin(page, 20, status).catch(() => ({
    posts: [], meta: { total: 0, page: 1, perPage: 20, totalPages: 0 },
  }));

  const STATUS_COLORS: Record<string, string> = {
    PUBLISHED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    DRAFT: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    ARCHIVED: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{meta.total} posts</p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new"><Plus className="h-4 w-4" /> New post</Link>
        </Button>
      </div>

      {/* Status filter */}
      <div className="flex gap-2">
        {[{ label: "All", value: "" }, { label: "Published", value: "PUBLISHED" }, { label: "Drafts", value: "DRAFT" }, { label: "Archived", value: "ARCHIVED" }].map(({ label, value }) => (
          <Link key={value} href={`/admin/blog${value ? `?status=${value}` : ""}`}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${status === value || (!status && !value) ? "bg-cyan-500 text-[#0a1628]" : "bg-muted hover:bg-accent"}`}>
            {label}
          </Link>
        ))}
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Title", "Status", "Views", "Published", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {posts.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12" style={{ color: "var(--color-muted-foreground)" }}>No posts</td></tr>
            ) : (
              posts.map((post: any) => (
                <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{post.title}</p>
                      {post.tags.slice(0, 3).map((t: string) => (
                        <span key={t} className="text-[10px] mr-1 px-1.5 py-0.5 rounded"
                          style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[post.status]}`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{post.viewCount}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/blog/${post.id}`}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        style={{ color: "var(--color-muted-foreground)" }}>
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      {post.status === "PUBLISHED" && (
                        <Link href={`/blog/${post.slug}`} target="_blank"
                          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                          style={{ color: "var(--color-muted-foreground)" }}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
