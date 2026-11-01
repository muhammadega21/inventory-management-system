import z from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  is_active: z.boolean().default(true),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
