import { z } from "zod";

export const notificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  targetType: z.enum(["all", "specific", "bundle", "course", "liveClass"]),
  targetEntity: z.string().optional(),
  targetUsers: z.array(z.string()).optional(),
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
