// app/(store)/account/layout.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Package, User, MapPin, Heart, Settings, ChevronRight } from "lucide-react";

export const metadata: Metadata = { title: { template: "%s — My Account | Jabiyehome", default: "My Account" } };

const NAV = [
  { href: "/account", label: "Dashboard", Icon: User, exact: true },
  { href: "/account/orders", label: "My Orders", Icon: Package },
  { href: "/account/wishlist", label: "Wishlist", Icon: Heart },
  { href: "/account/addresses", label: "Addresses", Icon: MapPin },
  { href: "/account/settings", label: "Settings", Icon: Settings },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/account");

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border p-4 space-y-1" style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
                My Account
              </p>
              <p className="text-sm font-medium mt-0.5">{session.user.name}</p>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{session.user.email}</p>
            </div>
            {NAV.map(({ href, label, Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted group"
                style={{ color: "var(--color-foreground)" }}>
                <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--color-muted-foreground)" }} />
                {label}
                <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-muted-foreground)" }} />
              </Link>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
