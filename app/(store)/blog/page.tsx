// app/(store)/blog/page.tsx — Blog listing page
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/services/blog.service";
import Pagination from "@/components/common/Pagination";
import { Clock, Tag, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Security Blog — Expert Guides & News",
  description: "Home security tips, smart home guides, product reviews, and industry news from the Jabiyehome team.",
};

export const revalidate = 1800;

interface Props { searchParams: Promise<{ page?: string; tag?: string }> }

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = parseInt(sp.page ?? "1");
  const tag = sp.tag;

  const { posts, meta } = await getPublishedPosts(page, 9, tag).catch(() => ({
    posts: [],
    meta: { total: 0, page: 1, perPage: 9, totalPages: 0 },
  }));

  return (
    <div className="container py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <p className="text-sm font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-cyan-500)" }}>
          Security knowledge
        </p>
        <h1 className="font-display text-4xl font-bold mb-4">
          {tag ? `Posts tagged "${tag}"` : "The Jabiyehome Blog"}
        </h1>
        <p className="text-lg max-w-xl mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
          Expert guides, installation tips, product reviews, and security industry news.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-semibold">No posts found</p>
          <Link href="/blog" className="text-sm mt-2 inline-block hover:underline" style={{ color: "var(--color-cyan-500)" }}>
            View all posts
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group rounded-2xl border overflow-hidden hover:border-cyan-500/40 hover:shadow-lg transition-all duration-300"
                style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                {/* Cover image */}
                <div className="relative h-48 overflow-hidden" style={{ background: "var(--color-muted)" }}>
                  {post.coverImageUrl ? (
                    <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl font-bold" style={{ color: "var(--color-cyan-500)", opacity: 0.15 }}>
                        {post.title.charAt(0)}
                      </div>
                    </div>
                  )}
                  {/* Tags */}
                  {post.tags.slice(0, 2).map((t: string) => (
                    <div key={t} className="absolute top-3 left-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ background: "var(--color-navy-600)", color: "var(--color-cyan-400)" }}>
                        {t}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="font-semibold text-base leading-snug group-hover:text-cyan-500 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "var(--color-muted-foreground)" }}>
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t text-xs"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }}>
                    <div className="flex items-center gap-3">
                      {post.publishedAt && (
                        <span>{new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      )}
                      {post.readTimeMin && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {post.readTimeMin} min read
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" style={{ color: "var(--color-cyan-500)" }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <Pagination currentPage={meta.page} totalPages={meta.totalPages} />
        </>
      )}
    </div>
  );
}
