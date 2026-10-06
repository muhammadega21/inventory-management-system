import z from "zod";

const stockItemSchema = z.object({
  product_id: z.coerce.number().int().positive("Product is required"),

  quantity: z.coerce.number().int().positive("Quantity must be greater than 0"),
});

const stockInSchema = z.object({
  warehouse_id: z.coerce.number().int().positive("Warehouse is required"),

  supplier_id: z.coerce.number().int().positive().optional(),

  transaction_date: z.coerce.date().optional(),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional(),

  items: z.array(stockItemSchema).min(1, "At least one product is required"),
});

const stockOutSchema = z.object({
  warehouse_id: z.coerce.number().int().positive("Warehouse is required"),

  transaction_date: z.coerce.date().optional(),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional(),

  items: z.array(stockItemSchema).min(1, "At least one product is required"),
});

const stockAdjustmentItemSchema = z.object({
  product_id: z.coerce.number().int().positive("Product is required"),

  physical_quantity: z.coerce
    .number()
    .int()
    .nonnegative("Physical quantity cannot be negative"),
});

const stockAdjustmentSchema = z.object({
  warehouse_id: z.coerce.number().int().positive("Warehouse is required"),

  transaction_date: z.coerce.date().optional(),

  notes: z
    .string()
    .trim()
    .max(500, "Notes must be at most 500 characters")
    .optional(),

  items: z
    .array(stockAdjustmentItemSchema)
    .min(1, "At least one product is required"),
});

const stockMovementQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  search: z.string().trim().optional(),

  warehouseId: z.coerce.number().int().positive().optional(),

  productId: z.coerce.number().int().positive().optional(),

  type: z.enum(["IN", "OUT", "ADJUSTMENT"]).optional(),

  dateFrom: z.coerce.date().optional(),

  dateTo: z.coerce.date().optional(),

  sortBy: z
    .enum(["createdAt", "quantity", "quantity_before", "quantity_after"])
    .default("createdAt"),

  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type StockInInput = z.infer<typeof stockInSchema>;
export type StockOutInput = z.infer<typeof stockOutSchema>;
export type StockAdjustmentInput = z.infer<typeof stockAdjustmentSchema>;
export type StockMovementQuery = z.infer<typeof stockMovementQuerySchema>;

export {
  stockInSchema,
  stockOutSchema,
  stockAdjustmentSchema,
  stockMovementQuerySchema,
};
