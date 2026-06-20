"use client";
import { useState, useTransition } from "react";
import { FolderTree, Plus, Edit2, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Category { id: string; name: string; slug: string; depth: number; parentId: string | null; parent: { name: string } | null; _count: { products: number; children: number } }

export default function AdminCategoriesClient({ categories }: { categories: Category[] }) {
  const roots = categories.filter((c) => c.depth === 0);
  const byParent = (parentId: string) => categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm" style={{ color: "var(--color-muted-foreground)" }}>{categories.length} categories total</p>
        </div>
        <Button><Plus className="h-4 w-4" /> Add category</Button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
        <table className="w-full text-sm" style={{ background: "var(--color-card)" }}>
          <thead className="border-b" style={{ borderColor: "var(--color-border)", background: "var(--color-muted)" }}>
            <tr>
              {["Name", "Parent", "Products", "Subcategories", ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-muted-foreground)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {categories.map((cat, i) => (
              <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div style={{ width: `${cat.depth * 16}px` }} />
                    {cat.depth > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--color-muted-foreground)" }} />}
                    <FolderTree className="h-4 w-4 shrink-0" style={{ color: "var(--color-green-600)", opacity: cat.depth === 0 ? 1 : 0.6 }} />
                    <span className={cat.depth === 0 ? "font-semibold" : ""}>{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                  {cat.parent?.name ?? "—"}
                </td>
                <td className="px-4 py-3">{cat._count.products}</td>
                <td className="px-4 py-3">{cat._count.children}</td>
                <td className="px-4 py-3">
                  <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: "var(--color-muted-foreground)" }}>
                    <Edit2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
