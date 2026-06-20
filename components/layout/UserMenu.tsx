// components/layout/UserMenu.tsx — Session-aware user menu
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut, Package, Heart, Settings, LayoutDashboard, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserMenu() {
  const { data: session, status } = useSession();

  // Loading state — render nothing to avoid layout shift
  if (status === "loading") {
    return (
      <div className="h-9 w-9 rounded-full animate-pulse hidden sm:block"
        style={{ background: "var(--color-muted)" }} />
    );
  }

  if (!session?.user) {
    return (
      <Button variant="ghost" size="icon" asChild
        className="hidden sm:flex text-foreground/70 hover:text-foreground">
        <Link href="/login" aria-label="Sign in">
          <User className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  const user = session.user;
  const role = (user as any).role;
  const initials = user.name?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold hidden sm:flex transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            background: "color-mix(in srgb, var(--color-green-600) 18%, transparent)",
            color: "var(--color-green-600)",
          }}
          aria-label="User menu"
        >
          {user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.image} alt={user.name ?? ""} className="h-8 w-8 rounded-full object-cover" />
          ) : (
            initials
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="font-semibold">{user.name ?? "My Account"}</p>
          <p className="text-xs font-normal truncate" style={{ color: "var(--color-muted-foreground)" }}>
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders">
              <Package className="h-4 w-4" /> My Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/wishlist">
              <Heart className="h-4 w-4" /> Wishlist
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/settings">
              <Settings className="h-4 w-4" /> Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {(role === "ADMIN" || role === "SUPER_ADMIN") && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin">
                <Shield className="h-4 w-4" /> Admin panel
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
