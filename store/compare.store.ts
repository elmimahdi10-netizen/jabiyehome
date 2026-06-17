// store/compare.store.ts — Compare up to 4 products
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

const MAX_COMPARE = 4;

interface CompareStore {
  products: Product[];
  isBarVisible: boolean;
  addProduct: (product: Product) => boolean; // returns false if limit reached
  removeProduct: (id: string) => void;
  clearAll: () => void;
  isComparing: (id: string) => boolean;
  toggleBar: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      products: [],
      isBarVisible: false,

      addProduct: (product) => {
        if (get().products.length >= MAX_COMPARE) return false;
        if (get().products.some((p) => p.id === product.id)) return true; // already added
        set((s) => ({ products: [...s.products, product], isBarVisible: true }));
        return true;
      },

      removeProduct: (id) => {
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          isBarVisible: s.products.length - 1 > 0,
        }));
      },

      clearAll: () => set({ products: [], isBarVisible: false }),

      isComparing: (id) => get().products.some((p) => p.id === id),

      toggleBar: () => set((s) => ({ isBarVisible: !s.isBarVisible })),
    }),
    {
      name: "jabiyehome-compare",
      partialize: (s) => ({ products: s.products }),
    }
  )
);
