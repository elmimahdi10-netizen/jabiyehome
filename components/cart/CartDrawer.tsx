"use client";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils/currency";

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCartStore();
  const drawerRef = useRef<HTMLDivElement>(null);

  const subtotal = getSubtotal();
  const itemCount = getItemCount();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-[420px] bg-background border-l shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-cyan-500" />
                <h2 className="font-semibold text-lg">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-cyan-500 text-navy-900 text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                    <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">Your cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add products to get started
                    </p>
                  </div>
                  <Button variant="glow" onClick={closeCart} asChild>
                    <Link href="/products">Browse products</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 px-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const price =
                        (item.product.salePrice ?? item.product.price) +
                        (item.variant?.priceModifier ?? 0);
                      const primaryImage = item.product.images?.find(
                        (img) => img.isPrimary
                      ) ?? item.product.images?.[0];

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 py-4 border-b last:border-0"
                        >
                          {/* Image */}
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-muted shrink-0">
                            {primaryImage ? (
                              <Image
                                src={primaryImage.url}
                                alt={primaryImage.altText ?? item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Shield className="h-8 w-8 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium hover:text-cyan-500 transition-colors line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {item.variant.name}: {item.variant.value}
                              </p>
                            )}
                            <p className="text-sm font-semibold text-cyan-500 mt-1">
                              {formatPrice(price)}
                            </p>

                            {/* Quantity controls */}
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center border rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1,
                                      item.variantId
                                    )
                                  }
                                  className="p-1.5 hover:bg-accent transition-colors rounded-l-lg"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="px-3 text-sm font-medium min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1,
                                      item.variantId
                                    )
                                  }
                                  className="p-1.5 hover:bg-accent transition-colors rounded-r-lg"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>

                              <button
                                onClick={() =>
                                  removeItem(item.productId, item.variantId)
                                }
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                aria-label="Remove item"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-5 space-y-4">
                {/* Trust badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-green-500" />
                    Secure checkout
                  </span>
                  <span>•</span>
                  <span>Free shipping over $299</span>
                </div>

                <Separator />

                {/* Subtotal */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold text-base">{formatPrice(subtotal)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Taxes and shipping calculated at checkout
                </p>

                {/* Actions */}
                <div className="space-y-2">
                  <Button variant="glow" className="w-full" size="lg" asChild>
                    <Link href="/checkout" onClick={closeCart}>
                      Checkout <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={closeCart} asChild>
                    <Link href="/cart">View full cart</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
