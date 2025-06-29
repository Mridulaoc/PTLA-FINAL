import { z } from "zod";

export const settingsSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(50, { message: "First name must be less than 50 characters" }),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(50, { message: "Last name must be less than 50 characters" }),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Invalid email format"
    )
    .min(5, "Email must be at least 5 characters long")
    .email("Invalid email address")
    .nonempty("Email is required"),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must be less than 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  phone: z
    .string()
    .regex(/^(\+\d{1,3}[- ]?)?\d{10}$/, { message: "Invalid phone number" })
    .optional()
    .or(z.literal("")),
  occupation: z
    .string()
    .max(100, { message: "Occupation must be less than 100 characters" })
    .optional(),
  bio: z
    .string()
    .max(500, { message: "Biography must be less than 500 characters" })
    .optional(),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;
