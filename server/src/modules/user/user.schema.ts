import { UserRole } from "@prisma/client";
import z from "zod";

const createUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(UserRole),
  is_active: z.boolean().default(true),
});

const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(20, "Name must be at most 20 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(1, "Password is required").optional(),
  role: z.enum(UserRole).optional(),
  is_active: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export { createUserSchema, updateUserSchema };
