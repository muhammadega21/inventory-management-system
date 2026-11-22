import z from "zod";

export const warehouseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters"),
  city: z
    .string()
    .trim()
    .min(3, "City must be at least 3 characters")
    .max(50, "City must be at most 50 characters"),
  address: z
    .string()
    .trim()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  is_active: z.boolean().default(true),
});

export type WarehouseFormData = z.infer<typeof warehouseFormSchema>;
