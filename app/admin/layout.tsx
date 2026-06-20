// app/admin/layout.tsx — Admin shell with sidebar navigation
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag,
  FolderTree, Settings, Shield, LogOut, BarChart3, Star, BookOpen
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, exact: true },
  { href: "/admin/orders", label: "Orders", Icon: ShoppingCart },
  { href: "/admin/products", label: "Products", Icon: Package },
  { href: "/admin/categories", label: "Categories", Icon: FolderTree },
  { href: "/admin/customers", label: "Customers", Icon: Users },
  { href: "/admin/coupons", label: "Coupons", Icon: Tag },
  { href: "/admin/reviews", label: "Reviews", Icon: Star },
  { href: "/admin/blog", label: "Blog", Icon: BookOpen },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-56 border-r flex flex-col"
        style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
        {/* Logo */}
        <div className="h-16 flex items-center gap-2 px-5 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}>
          <div className="h-8 w-8 rounded-lg flex items-center justify-center"
            style={{ background: "#111827" }}>
            <Shield className="h-5 w-5" style={{ color: "var(--color-cyan-500)" }} />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Jabiyehome</p>
            <p className="text-[10px] uppercase tracking-widest leading-none mt-0.5"
              style={{ color: "#16A34A" }}>Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted group"
              style={{ color: "var(--color-foreground)" }}>
              <Icon className="h-4 w-4 shrink-0" style={{ color: "var(--color-muted-foreground)" }} />
              {label}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t space-y-0.5" style={{ borderColor: "var(--color-border)" }}>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
            style={{ color: "var(--color-muted-foreground)" }}>
            <BarChart3 className="h-4 w-4" /> View store
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-600 dark:hover:text-red-400"
              style={{ color: "var(--color-muted-foreground)" }}>
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-56 flex flex-col">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b shrink-0"
          style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
          <div />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold leading-none">{session.user.name}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>{role}</p>
            </div>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{ background: "#111827", color: "#16A34A" }}>
              {session.user.name?.charAt(0) ?? "A"}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
