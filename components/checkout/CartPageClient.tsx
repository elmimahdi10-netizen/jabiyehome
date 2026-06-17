"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Minus, Plus, ArrowRight,
  Shield, Truck, RotateCcw, Tag, X
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/currency";
import CheckoutButton from "./CheckoutButton";

export default function CartPageClient() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const subtotal = getSubtotal();
  const shipping = subtotal >= 299 ? 0 : 14.99;
  const estimated = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container py-24 text-center">
        <div className="h-24 w-24 rounded-full mx-auto flex items-center justify-center mb-6"
          style={{ background: "var(--color-muted)" }}>
          <ShoppingCart className="h-12 w-12" style={{ color: "var(--color-muted-foreground)", opacity: 0.4 }} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="mb-8" style={{ color: "var(--color-muted-foreground)" }}>
          Start building your home security system
        </p>
        <Button asChild size="lg">
          <Link href="/products">Browse products <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}>
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const primary = item.product.images?.find(img => img.isPrimary) ?? item.product.images?.[0];
              const price = (item.product.salePrice ?? item.product.price) + (item.variant?.priceModifier ?? 0);
              return (
                <motion.div key={item.id} layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex gap-4 p-5 ${i > 0 ? "border-t" : ""}`}
                  style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                  {/* Image */}
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0"
                    style={{ background: "var(--color-muted)" }}>
                    {primary && (
                      <Image src={primary.url} alt={primary.altText ?? item.product.name}
                        fill className="object-cover" sizes="96px" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.slug}`}
                      className="text-sm font-semibold hover:underline line-clamp-2">
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                        {item.variant.name}: {item.variant.value}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-3">
                      {/* Qty */}
                      <div className="flex items-center rounded-lg border overflow-hidden"
                        style={{ borderColor: "var(--color-border)" }}>
                        <button onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label="Decrease quantity">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 text-sm font-semibold min-w-[2.5rem] text-center border-x"
                          style={{ borderColor: "var(--color-border)" }}>
                          {item.quantity}
                        </span>
                        <button onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                          aria-label="Increase quantity">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base font-bold">{formatPrice(price * item.quantity)}</span>
                        <button onClick={() => removeItem(item.productId, item.variantId)}
                          className="transition-colors hover:text-red-500"
                          style={{ color: "var(--color-muted-foreground)" }}
                          aria-label="Remove item">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="space-y-4">
          <div className="rounded-xl border p-5 space-y-4"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            <h2 className="font-semibold text-lg">Order summary</h2>

            {/* Coupon */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                  style={{ color: "var(--color-muted-foreground)" }} />
                <Input placeholder="Coupon code" value={couponCode}
                  onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  className="pl-9 uppercase text-sm" />
              </div>
              <Button variant="outline" size="default">Apply</Button>
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted-foreground)" }}>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "var(--color-muted-foreground)" }}>Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600 dark:text-green-400 font-medium">Free</span> : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                <span>Taxes</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-base">
                <span>Estimated total</span>
                <span>{formatPrice(estimated)}</span>
              </div>
            </div>

            {subtotal < 299 && (
              <p className="text-xs rounded-lg px-3 py-2"
                style={{ background: "color-mix(in srgb, var(--color-cyan-500) 8%, transparent)", color: "var(--color-cyan-500)" }}>
                Add {formatPrice(299 - subtotal)} more for free shipping
              </p>
            )}

            <CheckoutButton size="lg" className="w-full" />

            <p className="text-xs text-center" style={{ color: "var(--color-muted-foreground)" }}>
              Taxes and final shipping calculated at checkout
            </p>
          </div>

          {/* Trust badges */}
          <div className="rounded-xl border p-4 space-y-2"
            style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
            {[
              { Icon: Shield, text: "Secure 256-bit SSL checkout" },
              { Icon: Truck, text: "Free shipping on orders over $299" },
              { Icon: RotateCcw, text: "30-day hassle-free returns" },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 text-xs"
                style={{ color: "var(--color-muted-foreground)" }}>
                <Icon className="h-4 w-4 text-green-500 shrink-0" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
