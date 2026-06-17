"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  User,
  Menu,
  X,
  Shield,
  ChevronDown,
  Sun,
  Moon,
  Bell,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils/cn";
import { useCartStore } from "@/store/cart.store";
import { useUIStore } from "@/store/ui.store";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import CartDrawer from "@/components/cart/CartDrawer";
import UserMenu from "./UserMenu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const { toggleMobileNav, isMobileNavOpen, toggleSearch } = useUIStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setActiveMenu(null);
  }, [pathname]);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefersDark);
    setIsDark(dark);
    root.classList.toggle("dark", dark);
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleMenuEnter = (label: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(label);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        {/* Promo bar */}
        <div className="bg-navy-600 dark:bg-navy-700 text-white py-2 text-center text-xs font-medium tracking-wide">
          <span className="hidden sm:inline">
            🔒 Free professional installation on orders over $299 —{" "}
          </span>
          <Link href="/category/kits" className="underline underline-offset-2 hover:text-cyan-300 transition-colors">
            Shop Security Kits
          </Link>
        </div>

        <div className="container">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative">
                <Shield className="h-7 w-7 text-cyan-500 transition-transform group-hover:scale-110 duration-200" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-cyan-400 rounded-full animate-pulse" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                Jabiye<span className="text-cyan-500">Home</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-1 ml-4"
              onMouseLeave={handleMenuLeave}
            >
              {navigation.map((item) => (
                <div key={item.label} className="relative">
                  <button
                    onMouseEnter={() =>
                      item.categories ? handleMenuEnter(item.label) : undefined
                    }
                    onClick={() =>
                      item.href
                        ? (window.location.href = item.href)
                        : handleMenuEnter(item.label)
                    }
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                      "text-foreground/80 hover:text-foreground hover:bg-accent/50",
                      activeMenu === item.label && "text-foreground bg-accent/50"
                    )}
                  >
                    {item.label}
                    {item.categories && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-200",
                          activeMenu === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {activeMenu === item.label && item.categories && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onMouseEnter={() => handleMenuEnter(item.label)}
                        onMouseLeave={handleMenuLeave}
                        className="absolute top-full left-0 mt-1 w-[680px] rounded-2xl border bg-popover shadow-xl overflow-hidden"
                        style={{ left: "50%", transform: "translateX(-40%)" }}
                      >
                        <div className="flex">
                          {/* Categories */}
                          <div className="flex-1 p-5 grid grid-cols-2 gap-x-6 gap-y-1">
                            {item.categories.map((cat) => (
                              <div key={cat.label}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 mt-1">
                                  {cat.label}
                                </p>
                                {cat.items.map((sub) => (
                                  <Link
                                    key={sub.href}
                                    href={sub.href}
                                    className="group flex items-start gap-2 py-1.5 px-2 rounded-lg hover:bg-accent transition-colors"
                                    onClick={() => setActiveMenu(null)}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-sm font-medium text-foreground group-hover:text-cyan-500 transition-colors">
                                          {sub.label}
                                        </span>
                                        {sub.badge && (
                                          <Badge variant="cyan" className="text-[10px] py-0 px-1.5">
                                            {sub.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      {sub.description && (
                                        <p className="text-xs text-muted-foreground truncate">
                                          {sub.description}
                                        </p>
                                      )}
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            ))}
                          </div>

                          {/* Featured panel */}
                          {item.featured && (
                            <Link
                              href={item.featured.href}
                              onClick={() => setActiveMenu(null)}
                              className="w-48 bg-navy-600 dark:bg-navy-700 p-5 flex flex-col justify-end group"
                            >
                              <div className="flex-1 flex items-center justify-center">
                                <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center">
                                  <Shield className="h-10 w-10 text-cyan-400" />
                                </div>
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                                  {item.featured.title}
                                </p>
                                <p className="text-xs text-white/60 mt-1 line-clamp-2">
                                  {item.featured.description}
                                </p>
                                <p className="text-xs text-cyan-400 mt-2 font-medium">
                                  Learn more →
                                </p>
                              </div>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
              <Link
                href="/blog"
                className="px-3 py-2 rounded-lg text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                Blog
              </Link>
            </nav>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSearch}
                className="text-foreground/70 hover:text-foreground"
                aria-label="Open search"
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="text-foreground/70 hover:text-foreground hidden sm:flex"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* Wishlist */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="text-foreground/70 hover:text-foreground hidden sm:flex"
                aria-label="Wishlist"
              >
                <Link href="/account/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>

              {/* User menu */}
              <UserMenu />

              {/* Cart */}
              <Button
                variant="ghost"
                size="icon"
                onClick={openCart}
                className="relative text-foreground/70 hover:text-foreground"
                aria-label={`Shopping cart, ${itemCount} items`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-cyan-500 text-[10px] font-bold text-navy-900 flex items-center justify-center"
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </motion.span>
                )}
              </Button>

              {/* Mobile menu toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobileNav}
                className="lg:hidden text-foreground/70 hover:text-foreground"
                aria-label="Toggle mobile menu"
              >
                {isMobileNavOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header + promo bar */}
      <div className="h-[104px]" />

      {/* Overlays */}
      <SearchOverlay />
      <CartDrawer />
      <MobileNav />
    </>
  );
}
