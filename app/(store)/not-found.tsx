// app/(store)/not-found.tsx — Custom 404 page for the storefront
import Link from "next/link";
import { Search, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Large 404 */}
        <div>
          <p className="text-[120px] font-black leading-none"
            style={{ color: "color-mix(in srgb, var(--color-cyan-500) 15%, transparent)", fontFamily: "var(--font-display)" }}>
            404
          </p>
          <h1 className="text-2xl font-bold -mt-4">Page not found</h1>
          <p className="text-sm mt-3 max-w-sm mx-auto" style={{ color: "var(--color-muted-foreground)" }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Helpful links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-sm mx-auto">
          {[
            { label: "Security cameras", href: "/category/cameras" },
            { label: "Alarm systems", href: "/category/alarms" },
            { label: "Smart home", href: "/category/smart-home" },
            { label: "Security kits", href: "/category/kits" },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors hover:border-cyan-500/40 hover:bg-cyan-500/5"
              style={{ borderColor: "var(--color-border)" }}>
              <ArrowRight className="h-3.5 w-3.5" style={{ color: "var(--color-cyan-500)" }} />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/"><Home className="h-4 w-4" /> Home</Link></Button>
          <Button variant="outline" asChild><Link href="/products"><Search className="h-4 w-4" /> All products</Link></Button>
        </div>
      </div>
    </div>
  );
}
