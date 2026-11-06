import z from "zod";

export const userFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["ADMIN", "STAFF"]),
  is_active: z.boolean().default(true),
});

export type UserFormData = z.infer<typeof userFormSchema>;
