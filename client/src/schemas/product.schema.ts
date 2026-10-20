import { z } from "zod";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

const productImageSchema = z
  .custom<FileList | undefined>(
    (value) =>
      value === undefined ||
      (typeof FileList !== "undefined" && value instanceof FileList),
    { message: "File gambar tidak valid" },
  )
  .refine(
    (files) =>
      !files || files.length === 0 || allowedImageTypes.includes(files[0].type),
    "Pilih gambar JPG, PNG, atau WebP",
  )
  .refine(
    (files) => !files || files.length === 0 || files[0].size <= 2 * 1024 * 1024,
    "Ukuran gambar maksimum 2 MB",
  )
  .optional();

export const productFormSchema = z.object({
  category_id: z.coerce.number().int().positive("Kategori wajib dipilih"),
  name: z
    .string()
    .trim()
    .min(3, "Nama produk minimal 3 karakter")
    .max(50, "Nama produk maksimal 50 karakter"),
  unit: z
    .string()
    .trim()
    .min(1, "Satuan wajib diisi")
    .max(15, "Satuan maksimal 15 karakter"),
  minimum_stock: z.coerce
    .number()
    .int("Stok minimum harus berupa bilangan bulat")
    .min(0, "Stok minimum tidak boleh negatif"),
  description: z.string().trim().max(500, "Deskripsi maksimal 500 karakter"),
  is_active: z.boolean(),
  image: productImageSchema,
});

export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
