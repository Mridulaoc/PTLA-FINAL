import { z } from "zod";

export const lessonSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be atleast 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be atleast 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  videoUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)),
});
export type LessonFormData = z.infer<typeof lessonSchema>;
