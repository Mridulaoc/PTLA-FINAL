import { z } from "zod";

export const bundleSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title must not exceed 100 characters" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" }),
  discountedPrice: z
    .number()
    .positive({ message: "Price must be greater than 0" })
    .refine((val) => val >= 0, { message: "Price cannot be negative" }),
  featuredImage: z.string().min(1, { message: "Featured image is required" }),
  accessType: z.enum(["lifetime", "limited"], {
    message: "Access type must be either 'lifetime' or 'limited'",
  }),
  accessPeriodDays: z
    .number()
    .nullable()
    .refine((val) => val === null || val > 0, {
      message: "Access period must be a positive number",
    }),
});

export type BundleFormValues = z.infer<typeof bundleSchema>;
