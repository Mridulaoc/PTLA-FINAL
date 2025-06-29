import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  visibility: z.enum(["public", "private"]) as z.ZodType<"public" | "private">,
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(0, "Price must be a positive number or zero"),
  introVideoUrl: z.string().url("Must be a valid URL").or(z.string().length(0)),
  whatYouWillLearn: z
    .string()
    .min(10, "What You Will Learn must be at least 10 characters long"),
  targetAudience: z
    .string()
    .min(10, "Target Audience must be at least 10 characters long"),
  durationHours: z.coerce.number().min(0, "Hours must be positive or zero"),
  durationMinutes: z.coerce
    .number()
    .min(0, "Minutes must be positive or zero")
    .max(59, "Minutes must be less than 60"),
  featuredImage: z.string().min(1, "Featured image is required"),
});

export type CourseFormData = z.infer<typeof courseSchema>;
