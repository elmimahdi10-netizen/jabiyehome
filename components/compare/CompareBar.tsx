// components/compare/CompareBar.tsx — Sticky comparison tray
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/store/compare.store";
import { formatPrice } from "@/lib/utils/currency";

export default function CompareBar() {
  const { products, isBarVisible, removeProduct, clearAll } = useCompareStore();

  if (!isBarVisible || products.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-30 border-t shadow-2xl"
        style={{ background: "var(--color-card)", borderColor: "var(--color-border)" }}
      >
        <div className="container">
          <div className="flex items-center gap-4 py-3">
            <div className="flex items-center gap-2 shrink-0">
              <BarChart2 className="h-4 w-4" style={{ color: "var(--color-green-600)" }} />
              <span className="text-sm font-semibold">
                Compare ({products.length}/4)
              </span>
            </div>

            {/* Product thumbnails */}
            <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar">
              {products.map((product) => {
                const img = product.images?.find((i) => i.isPrimary) ?? product.images?.[0];
                return (
                  <div key={product.id}
                    className="flex items-center gap-2 shrink-0 p-2 rounded-xl border"
                    style={{ borderColor: "var(--color-border)", background: "var(--color-background)" }}>
                    <div className="h-10 w-10 rounded-lg overflow-hidden"
                      style={{ background: "var(--color-muted)" }}>
                      {img ? (
                        <Image src={img.url} alt={product.name} width={40} height={40} className="object-cover" />
                      ) : (
                        <Shield className="h-5 w-5 m-2.5" style={{ color: "var(--color-muted-foreground)", opacity: 0.4 }} />
                      )}
                    </div>
                    <div className="max-w-[140px] hidden sm:block">
                      <p className="text-xs font-medium truncate">{product.name}</p>
                      <p className="text-xs font-bold" style={{ color: "var(--color-green-600)" }}>
                        {formatPrice(product.salePrice ?? product.price)}
                      </p>
                    </div>
                    <button onClick={() => removeProduct(product.id)}
                      className="p-1 rounded transition-colors hover:text-red-500"
                      style={{ color: "var(--color-muted-foreground)" }}
                      aria-label={`Remove ${product.name} from comparison`}>
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}

              {/* Empty slots */}
              {[...Array(4 - products.length)].map((_, i) => (
                <div key={i} className="h-14 w-16 rounded-xl border-2 border-dashed shrink-0 hidden sm:flex items-center justify-center"
                  style={{ borderColor: "var(--color-border)" }}>
                  <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>+</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={clearAll}
                className="text-xs hover:underline"
                style={{ color: "var(--color-muted-foreground)" }}>
                Clear
              </button>
              <Button asChild size="sm" disabled={products.length < 2}>
                <Link href={`/compare?ids=${products.map((p) => p.id).join(",")}`}>
                  Compare <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
