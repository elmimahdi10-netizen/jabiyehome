// components/admin/AdminProductActions.tsx — Row action buttons for product table
"use client";
import { useState, useTransition } from "react";
import Link from "next/link";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import { deleteProductAction } from "@/lib/actions/product.actions";

interface Props { productId: string; productName: string; }

export default function AdminProductActions({ productId, productName }: Props) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProductAction(productId);
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>Unpublish?</span>
        <button onClick={handleDelete} disabled={isPending}
          className="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors">
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
        </button>
        <button onClick={() => setShowConfirm(false)} className="text-xs px-2 py-1 rounded hover:bg-muted transition-colors">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link href={`/admin/products/${productId}`}
        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
        style={{ color: "var(--color-muted-foreground)" }}
        title={`Edit ${productName}`}>
        <Edit2 className="h-4 w-4" />
      </Link>
      <button onClick={() => setShowConfirm(true)}
        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-500 transition-colors"
        style={{ color: "var(--color-muted-foreground)" }}
        title={`Delete ${productName}`}>
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
