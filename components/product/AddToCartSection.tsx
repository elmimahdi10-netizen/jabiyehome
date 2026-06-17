// components/product/AddToCartSection.tsx — Variant picker, quantity stepper, and add-to-cart
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Minus, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import type { Product, ProductVariant } from "@/types";
import { cn } from "@/lib/utils/cn";

interface AddToCartSectionProps {
  product: Product;
}

export default function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants[0]
  );
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Group variants by name so e.g. all "Colour" variants appear together
  const variantGroups = product.variants.reduce<Record<string, ProductVariant[]>>(
    (groups, variant) => {
      if (!groups[variant.name]) groups[variant.name] = [];
      groups[variant.name].push(variant);
      return groups;
    },
    {}
  );

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addItem(product, quantity, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <div className="space-y-5">
      {/* Variant selectors */}
      {Object.entries(variantGroups).map(([groupName, variants]) => (
        <div key={groupName}>
          <p className="text-sm font-semibold mb-2.5">
            {groupName}:{" "}
            <span className="font-normal" style={{ color: "var(--color-muted-foreground)" }}>
              {selectedVariant?.name === groupName ? selectedVariant.value : variants[0]?.value}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => setSelectedVariant(variant)}
                disabled={variant.stock === 0}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm border-2 transition-all duration-150 font-medium",
                  "disabled:opacity-40 disabled:cursor-not-allowed",
                  selectedVariant?.id === variant.id
                    ? "border-cyan-500 text-cyan-500 bg-cyan-500/10"
                    : "border-border hover:border-cyan-500/50"
                )}
              >
                {variant.value}
                {variant.stock === 0 && " — sold out"}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Quantity stepper */}
      <div>
        <p className="text-sm font-semibold mb-2.5">Quantity</p>
        <div className="flex items-center border rounded-xl w-fit overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-3 hover:bg-accent transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-6 py-3 text-base font-semibold min-w-[3rem] text-center border-x"
            style={{ borderColor: "var(--color-border)" }}>
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-4 py-3 hover:bg-accent transition-colors"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add to cart */}
      <Button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        size="xl"
        className={cn(
          "w-full transition-all duration-300",
          isAdded
            ? "bg-green-500 hover:bg-green-500 text-white"
            : ""
        )}
      >
        {isAdded ? (
          <><Check className="h-5 w-5" /> Added to cart!</>
        ) : product.stock === 0 ? (
          "Out of stock"
        ) : (
          <><ShoppingCart className="h-5 w-5" /> Add to cart</>
        )}
      </Button>

      {/* Low stock warning */}
      {product.stock > 0 && product.stock <= 10 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-amber-600 dark:text-amber-400"
        >
          ⚡ Only {product.stock} left in stock — order soon
        </motion.p>
      )}
    </div>
  );
}
