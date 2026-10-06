import z from "zod";

const createWarehouseSchema = z.object({
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
  // capacity: z.coerce
  //   .number()
  //   .min(1, "Capacity must be greater than 0")
  //   .optional(),
  // capacityUnit: z
  //   .string()
  //   .trim()
  //   .max(50, "Capacity unit must be at most 50 characters")
  //   .optional(),
  is_active: z.boolean().default(true),
});

const updateWarehouseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(30, "Name must be at most 30 characters")
    .optional(),
  city: z
    .string()
    .trim()
    .min(3, "City must be at least 3 characters")
    .max(50, "City must be at most 50 characters")
    .optional(),
  address: z
    .string()
    .trim()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  // capacity: z.coerce
  //   .number()
  //   .min(1, "Capacity must be greater than 0")
  //   .optional(),
  // capacityUnit: z
  //   .string()
  //   .trim()
  //   .max(50, "Capacity unit must be at most 50 characters")
  //   .optional(),
  is_active: z.boolean().optional(),
});

export type CreateWarehouseInput = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouseInput = z.infer<typeof updateWarehouseSchema>;

export { createWarehouseSchema, updateWarehouseSchema };
