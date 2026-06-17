import { z } from "zod";

export const productFilterSchema = z.object({
  q: z.string().optional(),
  categorySlug: z.string().optional(),
  brandIds: z.array(z.string()).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "rating", "popular"])
    .optional()
    .default("newest"),
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).max(48).optional().default(24),
});

export type ProductFilterSchema = z.infer<typeof productFilterSchema>;
