import { z } from "zod";

export const addressSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  company: z.string().max(100).optional(),
  line1: z.string().min(1).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(1).max(20),
  country: z.string().length(2),
  phone: z.string().max(20).optional(),
  isDefault: z.boolean().optional().default(false),
});

export const couponSchema = z.object({
  code: z.string().min(1).max(50).toUpperCase(),
});

export type AddressSchema = z.infer<typeof addressSchema>;
export type CouponSchema = z.infer<typeof couponSchema>;
