// app/api/v1/search/route.ts — Product search with instant suggestions
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const rlResult = rateLimit(`search:${ip}`, RATE_LIMITS.search.limit, RATE_LIMITS.search.windowMs);
  if (!rlResult.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(Math.ceil((rlResult.resetAt - Date.now()) / 1000)) } });
  }
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "6"), 12);
  const mode = searchParams.get("mode") ?? "suggest"; // "suggest" | "full"

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  try {
    const where = {
      isPublished: true,
      OR: [
        { name: { contains: q, mode: "insensitive" as const } },
        { description: { contains: q, mode: "insensitive" as const } },
        { sku: { contains: q, mode: "insensitive" as const } },
        { tags: { has: q.toLowerCase() } },
        { category: { name: { contains: q, mode: "insensitive" as const } } },
        { brand: { name: { contains: q, mode: "insensitive" as const } } },
      ],
    };

    if (mode === "suggest") {
      // Lightweight suggestion query — minimal fields, fast
      const products = await prisma.product.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          salePrice: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          category: { select: { name: true } },
        },
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      });

      const results = (products as any[]).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        salePrice: p.salePrice ? Number(p.salePrice) : null,
        imageUrl: p.images?.[0]?.url ?? null,
        category: p.category?.name ?? null,
      }));

      return NextResponse.json({ results, total: results.length, query: q });
    }

    // Full search — redirect to products page is handled client-side
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, images: { where: { isPrimary: true }, take: 1 }, variants: true },
        take: limit,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ results: products, total, query: q });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ results: [], total: 0 }, { status: 500 });
  }
}
