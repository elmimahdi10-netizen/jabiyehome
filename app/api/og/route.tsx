// app/api/og/route.tsx — Dynamic Open Graph image generation
// Generates branded OG images for products and blog posts on the fly.
// Usage: /api/og?title=Product+Name&subtitle=Security+Cameras&type=product
import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "Jabiyehome";
  const subtitle = searchParams.get("subtitle") ?? "Professional Home Security";
  const type = searchParams.get("type") ?? "default";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          background: "#0a1628",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(6,182,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Left cyan accent bar */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "8px",
            background: "#06b6d4",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 80px",
            width: "100%",
            position: "relative",
          }}
        >
          {/* Logo row */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "#06b6d4",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🛡️
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "24px", fontWeight: 700, color: "white" }}>
                Secure<span style={{ color: "#06b6d4" }}>Home</span>
              </span>
              {type !== "default" && (
                <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "2px" }}>
                  {type === "product" ? "Product" : type === "blog" ? "Blog" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {subtitle && (
              <span
                style={{
                  fontSize: "18px",
                  color: "#06b6d4",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                {subtitle}
              </span>
            )}
            <div
              style={{
                fontSize: title.length > 50 ? "44px" : "58px",
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                maxWidth: "900px",
              }}
            >
              {title}
            </div>
          </div>

          {/* Bottom row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)" }}>
              Jabiyehome.com
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(6,182,212,0.15)",
                border: "1px solid rgba(6,182,212,0.3)",
                borderRadius: "100px",
                padding: "8px 20px",
              }}
            >
              <span style={{ fontSize: "14px", color: "#06b6d4", fontWeight: 600 }}>
                Professional Home Security
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
