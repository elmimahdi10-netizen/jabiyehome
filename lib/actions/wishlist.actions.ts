// lib/actions/wishlist.actions.ts
"use server";

import { auth } from "@/lib/auth";
import { toggleWishlistItem } from "@/lib/services/wishlist.service";
import { revalidatePath } from "next/cache";

export async function toggleWishlistAction(
  productId: string,
  productSlug: string
): Promise<{ success: boolean; added?: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Sign in to save products to your wishlist." };
  }

  try {
    const { added } = await toggleWishlistItem(session.user.id, productId);
    revalidatePath(`/products/${productSlug}`);
    revalidatePath("/account/wishlist");
    return { success: true, added };
  } catch {
    return { success: false, error: "Something went wrong." };
  }
}
