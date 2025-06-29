import { z } from "zod";

export const enrollmentSchema = z.object({
  userId: z.string().min(1, "User is required"),
  courseId: z.string().min(1, "Course is required"),
  enrollmentType: z.enum(["manual"]).default("manual"),
});

export type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;
