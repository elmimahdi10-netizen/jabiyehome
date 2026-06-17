// proxy.ts — Edge proxy: auth protection, rate limiting, security headers
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/account"];
const ADMIN_PREFIXES = ["/admin"];
const API_AUTH_PATHS = ["/api/auth/callback", "/api/auth/signin"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Determine session from NextAuth cookie
  const sessionCookie =
    req.cookies.get("__Secure-authjs.session-token")?.value ??
    req.cookies.get("authjs.session-token")?.value;
  const isAuthed = !!sessionCookie;

  // ─── Route protection ─────────────────────────────────────────────────────
  if (PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) && !isAuthed) {
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (ADMIN_PREFIXES.some((p) => pathname.startsWith(p)) && !isAuthed) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ─── Basic rate limiting on API routes ───────────────────────────────────
  // Note: in-memory rate limit (lib/rate-limit.ts) is called in API route handlers.
  // Here we only set rate-limit response headers for transparency.
  const response = NextResponse.next();

  // ─── Security headers ────────────────────────────────────────────────────
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(self)"
  );
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com https://placehold.co https://lh3.googleusercontent.com",
      "connect-src 'self' https://api.stripe.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png|.*\\.ico).*)",
  ],
};
