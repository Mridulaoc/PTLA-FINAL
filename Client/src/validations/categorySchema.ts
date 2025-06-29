import { z } from "zod";

export const categoriesSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Category name must be at least 2 characters" })
    .max(50, { message: "Category name must be less than 20 characters" }),
  description: z
    .string()
    .min(10, {
      message: "Category description must be at least 10 characters",
    })
    .max(100, {
      message: "Category description must be less than 100 characters",
    }),
});

export type CategoryFormData = z.infer<typeof categoriesSchema>;
