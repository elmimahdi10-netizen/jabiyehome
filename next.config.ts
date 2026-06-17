// next.config.ts — Production-hardened Next.js configuration
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimisation
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/*/image/upload/**" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      // Google profile images (OAuth)
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,   // 24 hours
  },

  // Compress responses
  compress: true,

  // Power headers in next.config (additional to middleware)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // Cache OG images
      {
        source: "/api/og(.*)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, s-maxage=86400" }],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      // www → non-www
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.Jabiyehome.com" }],
        destination: "https://Jabiyehome.com/:path*",
        permanent: true,
      },
      // Legacy URL compatibility
      { source: "/shop", destination: "/products", permanent: true },
      { source: "/shop/:path*", destination: "/products/:path*", permanent: true },
    ];
  },

  // Bundle optimisations
  experimental: {
    // Optimise package imports to reduce bundle size
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default nextConfig;
