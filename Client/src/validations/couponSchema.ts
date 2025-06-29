import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(20, "Coupon code must be at most 20 characters")
    .regex(
      /^[A-Z0-9]+$/,
      "Coupon code must contain only uppercase letters and numbers"
    ),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z
    .number()
    .positive("Discount value must be positive")
    .refine((val) => val <= 100, {
      message: "Percentage discount cannot exceed 100%",
      path: ["discountValue"],
    }),
  expiryDate: z.string().refine(
    (dateStr) => {
      const date = new Date(dateStr);
      return date > new Date();
    },
    {
      message: "Expiry date must be in the future",
    }
  ),
  isActive: z.boolean().optional(),
});

export type CouponFormValues = z.infer<typeof couponSchema>;
