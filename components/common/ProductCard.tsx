// components/common/ProductCard.tsx — Product card with cart, wishlist, and compare
"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Shield, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart.store";
import { useCompareStore } from "@/store/compare.store";
import { formatPrice, calculateDiscount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [compareWarning, setCompareWarning] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addItem = useCartStore((s) => s.addItem);
  const { addProduct, removeProduct, isComparing } = useCompareStore();
  const comparing = isComparing(product.id);

  const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const discount = product.salePrice ? calculateDiscount(product.price, product.salePrice) : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    setIsAddingToCart(true);
    addItem(product);
    setTimeout(() => setIsAddingToCart(false), 1800);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (comparing) {
      removeProduct(product.id);
      return;
    }
    const added = addProduct(product);
    if (!added) {
      setCompareWarning(true);
      setTimeout(() => setCompareWarning(false), 2500);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={cn("group relative rounded-2xl border overflow-hidden transition-shadow duration-300 hover:shadow-lg", className)}
      style={{ borderColor: "var(--color-border)", background: "var(--color-card)" }}
    >
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden"
          style={{ background: "var(--color-muted)" }}>
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.altText ?? product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-12 w-12" style={{ color: "var(--color-muted-foreground)", opacity: 0.2 }} />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {discount && (
              <Badge variant="destructive" className="text-xs font-bold">−{discount}%</Badge>
            )}
            {product.isFeatured && (
              <Badge variant="cyan" className="text-xs">Featured</Badge>
            )}
            {product.stock === 0 && (
              <Badge variant="secondary" className="text-xs">Out of stock</Badge>
            )}
          </div>

          {/* Compare button */}
          <button
            onClick={handleCompare}
            className={cn(
              "absolute top-2.5 right-2.5 h-8 w-8 rounded-xl flex items-center justify-center transition-all",
              "border opacity-0 group-hover:opacity-100",
              comparing
                ? "opacity-100 border-green-600 bg-green-600/10 text-green-600"
                : "border-white/20 bg-black/30 text-white hover:border-green-600 hover:bg-green-600/10 hover:text-green-600"
            )}
            aria-label={comparing ? "Remove from comparison" : "Add to comparison"}
            title={comparing ? "Remove from comparison" : "Compare"}
          >
            <BarChart2 className="h-4 w-4" />
          </button>

          {/* Compare limit warning */}
          {compareWarning && (
            <div className="absolute inset-x-2 bottom-2 text-xs text-center font-medium py-1.5 px-2 rounded-lg"
              style={{ background: "var(--color-[#111827])", color: "white" }}>
              Max 4 products can be compared
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        {product.category && (
          <p className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--color-green-600)" }}>
            {product.category.name}
          </p>
        )}

        {/* Name */}
        <Link href={`/products/${product.slug}`}
          className="block font-semibold text-sm leading-snug line-clamp-2 hover:text-green-600 transition-colors">
          {product.name}
        </Link>

        {/* Rating */}
        {product.avgRating != null && (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={cn("h-3 w-3", s <= Math.round(product.avgRating!) ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
              ))}
            </div>
            <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              ({product.reviewCount ?? 0})
            </span>
          </div>
        )}

        {/* Price + Add to cart */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-base">{formatPrice(product.salePrice ?? product.price)}</span>
            {product.salePrice && (
              <span className="text-xs ml-1.5 line-through" style={{ color: "var(--color-muted-foreground)" }}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center border transition-all duration-200",
              isAddingToCart
                ? "border-green-500 bg-green-500/10 text-green-500"
                : "border-border hover:border-green-600 hover:bg-green-600/10 hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
            )}
            style={{ color: isAddingToCart ? undefined : "var(--color-muted-foreground)" }}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
