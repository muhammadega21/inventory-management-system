import z from "zod";

const createSupplierSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters"),
  contact_person: z
    .string()
    .min(3, "Contact person must be at least 3 characters")
    .max(50, "Contact person must be at most 50 characters"),
  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters")
    .max(20, "Phone must be at most 20 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters")
    .max(50, "Email must be at most 50 characters"),
  city: z
    .string()
    .min(3, "City must be at least 3 characters")
    .max(50, "City must be at most 50 characters"),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters"),
  is_active: z.coerce.boolean().default(true),
});

const updateSupplierSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be at most 50 characters")
    .optional(),
  contact_person: z
    .string()
    .min(3, "Contact person must be at least 3 characters")
    .max(50, "Contact person must be at most 50 characters")
    .optional(),
  phone: z
    .string()
    .min(3, "Phone must be at least 3 characters")
    .max(20, "Phone must be at most 20 characters")
    .optional(),
  email: z
    .string()
    .email("Invalid email")
    .min(3, "Email must be at least 3 characters")
    .max(50, "Email must be at most 50 characters")
    .optional(),
  city: z
    .string()
    .min(3, "City must be at least 3 characters")
    .max(50, "City must be at most 50 characters")
    .optional(),
  address: z
    .string()
    .min(3, "Address must be at least 3 characters")
    .max(50, "Address must be at most 50 characters")
    .optional(),
  is_active: z.coerce.boolean().optional(),
});

export type CreateSupplierInput = z.infer<typeof createSupplierSchema>;
export type UpdateSupplierInput = z.infer<typeof updateSupplierSchema>;

export { createSupplierSchema, updateSupplierSchema };
