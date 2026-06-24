"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border/50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <svg viewBox="0 0 60 74" xmlns="http://www.w3.org/2000/svg" style={{ height: "48px", width: "38px" }}>
            <path d="M30 0 L60 12 L60 40 C60 58 47 67 30 74 C13 67 0 58 0 40 L0 12 Z" fill="#16A34A"/>
            <path d="M30 5 L55 16 L55 40 C55 56 43 64 30 70 C17 64 5 56 5 40 L5 16 Z" fill="#15803D"/>
            <polyline points="17,40 26,50 43,28" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div>
            <div style={{ fontSize: "20px", fontWeight: "800", color: "#111827", letterSpacing: "-0.5px", lineHeight: "1.1" }}>JABIYE</div>
            <div style={{ fontSize: "12px", fontWeight: "600", color: "#16A34A", letterSpacing: "4px", lineHeight: "1.1" }}>HOME</div>
          </div>
        </Link>

        {/* NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <Link href="/products" className="hover:text-text transition">Products</Link>
          <Link href="/category/smart-home" className="hover:text-text transition">Smart Home</Link>
          <Link href="/category/cameras" className="hover:text-text transition">Cameras</Link>
          <Link href="/category/alarms" className="hover:text-text transition">Alarms</Link>
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-4">
          <Link href="/account" className="text-text-secondary hover:text-text"><User size={20} /></Link>
          <Link href="/cart" className="relative text-text-secondary hover:text-text"><ShoppingCart size={20} /></Link>
          <Link href="/products" className="hidden md:inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition">Shop Now</Link>
        </div>

      </div>
    </header>
  );
}