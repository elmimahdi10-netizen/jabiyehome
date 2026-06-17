// app/api/v1/reviews/route.ts — Reviews API endpoint
import { NextRequest, NextResponse } from "next/server";
import { rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getProductReviews } from "@/lib/services/review.service";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimit(`reviews:${ip}`, RATE_LIMITS.api.limit, RATE_LIMITS.api.windowMs);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  const { searchParams } = req.nextUrl;
  const productId = searchParams.get("productId");
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("perPage") ?? "10");

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  try {
    const data = await getProductReviews(productId, page, perPage);
    return NextResponse.json({ success: true, ...data });
  } catch {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
