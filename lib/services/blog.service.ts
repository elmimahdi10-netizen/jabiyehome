// lib/services/blog.service.ts
import prisma from "@/lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalisePost(p: any) {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt ?? null,
    content: p.content,
    coverImageUrl: p.coverImageUrl ?? null,
    authorId: p.authorId,
    author: p.author ? { name: p.author.name, avatarUrl: p.author.avatarUrl } : null,
    status: p.status as "DRAFT" | "PUBLISHED" | "ARCHIVED",
    publishedAt: p.publishedAt instanceof Date ? p.publishedAt.toISOString() : (p.publishedAt ?? null),
    metaTitle: p.metaTitle ?? null,
    metaDesc: p.metaDesc ?? null,
    tags: p.tags ?? [],
    readTimeMin: p.readTimeMin ?? null,
    viewCount: p.viewCount,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
    updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
  };
}

export async function getPublishedPosts(page = 1, perPage = 9, tag?: string) {
  const where: any = {
    status: "PUBLISHED",
    publishedAt: { lte: new Date() },
    ...(tag ? { tags: { has: tag } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true, avatarUrl: true } } } as any,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts: (posts as unknown as any[]).map(normalisePost),
    meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) },
  };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: { author: { select: { name: true, avatarUrl: true } } } as any,
  });
  if (!post) return null;

  // Increment view count (fire-and-forget)
  prisma.blogPost.update({ where: { slug }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  return normalisePost(post as unknown);
}

export async function getRelatedPosts(slug: string, tags: string[], limit = 3) {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED", slug: { not: slug }, tags: { hasSome: tags } },
    include: { author: { select: { name: true, avatarUrl: true } } } as any,
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
  return (posts as unknown as any[]).map(normalisePost);
}

export async function getAllPostsAdmin(page = 1, perPage = 20, status?: string) {
  const where: any = status ? { status } : {};
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      include: { author: { select: { name: true } } } as any,
      orderBy: { updatedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.blogPost.count({ where }),
  ]);
  return { posts: (posts as unknown as any[]).map(normalisePost), meta: { total, page, perPage, totalPages: Math.ceil(total / perPage) } };
}
