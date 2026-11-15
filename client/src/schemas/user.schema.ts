import z from "zod";

const userFields = {
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["ADMIN", "STAFF"]),
  is_active: z.boolean().default(true),
};

export const userFormSchema = z.object({
  ...userFields,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const editUserFormSchema = z.object({
  ...userFields,
  password: z
    .string()
    .optional()
    .refine(
      (password) => !password || password.length >= 6,
      "Password must be at least 6 characters",
    ),
});

export type UserFormData = z.infer<typeof userFormSchema>;
