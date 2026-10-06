import z from "zod";

const createCategorySchema = z.object({
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

const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .nullable()
    .optional(),
  is_active: z.boolean().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export { createCategorySchema, updateCategorySchema };
