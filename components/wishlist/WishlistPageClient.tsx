// components/wishlist/WishlistPageClient.tsx
"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { toggleWishlistAction } from "@/lib/actions/wishlist.actions";
import { formatPrice, calculateDiscount } from "@/lib/utils/currency";
import type { Product } from "@/types";

interface WishlistItem { id: string; addedAt: string; product: Product }

export default function WishlistPageClient({ items: initialItems }: { items: WishlistItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [isPending, startTransition] = useTransition();
  const addItem = useCartStore((s) => s.addItem);

  const handleRemove = (productId: string, productSlug: string) => {
    startTransition(async () => {
      await toggleWishlistAction(productId, productSlug);
      setItems((prev) => prev.filter((i) => i.product.id !== productId));
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 mx-auto mb-4" style={{ color: "var(--color-muted-foreground)", opacity: 0.2 }} />
        <h2 className="text-xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-muted-foreground)" }}>
          Save products you love and come back to them later.
        </p>
        <Button asChild>
          <Link href="/products">Browse products <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
          {items.length} saved item{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const primary = item.product.images?.find((img) => img.isPrimary) ?? item.product.images?.[0];
            const price = item.product.salePrice ?? item.product.price;
            const discount = item.product.salePrice
              ? calculateDiscount(item.product.price, item.product.salePrice)
              : null;

            return (
              <motion.div key={item.id} layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-4 p-4 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}>
                {/* Image */}
                <Link href={`/products/${item.product.slug}`}
                  className="relative h-24 w-24 rounded-xl overflow-hidden shrink-0"
                  style={{ background: "var(--color-muted)" }}>
                  {primary ? (
                    <Image src={primary.url} alt={primary.altText ?? item.product.name}
                      fill className="object-cover" sizes="96px" />
                  ) : (
                    <Shield className="h-8 w-8 m-4" style={{ color: "var(--color-muted-foreground)", opacity: 0.3 }} />
                  )}
                </Link>

                <div className="flex-1 min-w-0 space-y-2">
                  <Link href={`/products/${item.product.slug}`}
                    className="text-sm font-semibold hover:underline line-clamp-2">
                    {item.product.name}
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{formatPrice(price)}</span>
                    {discount && (
                      <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                        −{discount}%
                      </span>
                    )}
                    {item.product.stock === 0 && (
                      <span className="text-xs text-red-500 font-medium">Out of stock</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="navy"
                      disabled={item.product.stock === 0}
                      onClick={() => handleAddToCart(item.product)}
                      className="text-xs h-8">
                      <ShoppingCart className="h-3.5 w-3.5" /> Add to cart
                    </Button>
                    <button onClick={() => handleRemove(item.product.id, item.product.slug)}
                      disabled={isPending}
                      className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500"
                      style={{ color: "var(--color-muted-foreground)" }}
                      aria-label="Remove from wishlist">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
