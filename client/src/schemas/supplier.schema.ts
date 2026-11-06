import z from "zod";

export const supplierFormSchema = z.object({
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
    .trim()
    .max(15, "Phone must be at most 15 characters")
    .refine(
      (value) => value === "" || /^\+?[0-9]{7,15}$/.test(value),
      "Phone must contain digits only and may start with +",
    )
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

export type SupplierFormData = z.infer<typeof supplierFormSchema>;
