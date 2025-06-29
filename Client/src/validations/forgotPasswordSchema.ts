import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

export type EmailFormInput = z.infer<typeof emailSchema>;
