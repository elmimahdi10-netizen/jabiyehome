"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/50">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        
        {/* LOGO */}
        <Link href="/" className="text-xl font-semibold text-text">
          Jabiye<span className="text-primary">Home</span>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link href="/products" className="hover:text-text transition">
            Products
          </Link>
          <Link href="/category/smart-home" className="hover:text-text transition">
            Smart Home
          </Link>
          <Link href="/category/cameras" className="hover:text-text transition">
            Cameras
          </Link>
          <Link href="/category/alarms" className="hover:text-text transition">
            Alarms
          </Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">

          {/* SEARCH (optionnel futur) */}
          
          {/* USER */}
          <Link href="/account" className="text-text-secondary hover:text-text">
            <User size={20} />
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="relative text-text-secondary hover:text-text"
          >
            <ShoppingCart size={20} />
          </Link>

          {/* CTA BUTTON */}
          <Link
            href="/products"
            className="hidden md:inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition"
          >
            Shop Now
          </Link>

        </div>
      </div>
    </header>
  );
}