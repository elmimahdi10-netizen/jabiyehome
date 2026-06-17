// app/(store)/blog/[slug]/page.tsx — Blog post detail
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts } from "@/lib/services/blog.service";
import { sanitizeBlogContent } from "@/lib/utils/sanitize";
import { Clock, Calendar, ArrowLeft, Tag } from "lucide-react";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDesc ?? post.excerpt ?? "",
    openGraph: {
      title: post.title,
      description: post.excerpt ?? "",
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      images: post.coverImageUrl ? [{ url: post.coverImageUrl }] : [],
    },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug).catch(() => null);
  if (!post) notFound();

  const related = await getRelatedPosts(slug, post.tags, 3).catch(() => []);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author?.name },
    publisher: { "@type": "Organization", name: "Jabiyehome" },
    ...(post.coverImageUrl ? { image: post.coverImageUrl } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="container py-10 max-w-3xl">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:underline"
          style={{ color: "var(--color-cyan-500)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag: string) => (
              <Link key={tag} href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full transition-colors hover:bg-accent"
                style={{ background: "var(--color-muted)", color: "var(--color-muted-foreground)" }}>
                <Tag className="h-3 w-3" /> {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="font-display text-4xl font-bold leading-tight mb-6">{post.title}</h1>

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm mb-8 pb-8 border-b flex-wrap"
          style={{ borderColor: "var(--color-border)", color: "var(--color-muted-foreground)" }}>
          {post.author?.name && (
            <span className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", color: "var(--color-cyan-500)" }}>
                {post.author.name.charAt(0)}
              </div>
              {post.author.name}
            </span>
          )}
          {post.publishedAt && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          )}
          {post.readTimeMin && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readTimeMin} min read
            </span>
          )}
          <span>{post.viewCount} views</span>
        </div>

        {/* Cover image */}
        {post.coverImageUrl && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image src={post.coverImageUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        {/* Content — sanitized before render to prevent XSS */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-cyan-500 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: sanitizeBlogContent(post.content) }}
        />

        {/* Related posts */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "var(--color-border)" }}>
            <h2 className="font-semibold text-xl mb-6">Related articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rp: any) => (
                <Link key={rp.id} href={`/blog/${rp.slug}`}
                  className="group p-4 rounded-xl border hover:border-cyan-500/40 transition-colors"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                  <p className="text-sm font-semibold group-hover:text-cyan-500 transition-colors line-clamp-2">{rp.title}</p>
                  {rp.readTimeMin && (
                    <p className="text-xs mt-2" style={{ color: "var(--color-muted-foreground)" }}>
                      {rp.readTimeMin} min read
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
