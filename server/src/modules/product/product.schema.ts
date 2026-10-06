import z from "zod";

const formBoolean = z.preprocess((value) => {
  if (value === "true") return true;
  if (value === "false") return false;

  return value;
}, z.boolean());

const createProductSchema = z.object({
  category_id: z.coerce
    .number()
    .min(1, "Category is required")
    .int()
    .positive(),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  unit: z
    .string()
    .trim()
    .min(1, "Unit is required")
    .max(15, "Unit must be at most 15 characters"),
  minimum_stock: z.coerce.number().int().min(0),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  is_active: formBoolean.default(true),
});

const updateProductSchema = z.object({
  category_id: z.coerce
    .number()
    .min(1, "Category is required")
    .int()
    .positive()
    .optional(),
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  unit: z
    .string()
    .trim()
    .max(15, "Unit must be at most 15 characters")
    .optional(),
  minimum_stock: z.coerce.number().int().min(0).optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .nullable()
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  is_active: formBoolean.optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export { createProductSchema, updateProductSchema };
