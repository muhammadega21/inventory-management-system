# 09 – Development Rules

## Urutan Pengembangan

```text
1. Backend setup
2. Prisma + PostgreSQL
3. Common utilities
4. Authentication
5. Authorization
6. Category
7. Supplier
8. Warehouse
9. Product
10. Inventory
11. Stock In
12. Stock Out
13. Adjustment
14. Stock Movement
15. Dashboard / Reports
16. React frontend integration
17. Testing
18. Production setup
```

## Cara Pengerjaan

Setiap tahap harus dijelaskan dengan:

- nama file.
- lokasi file.
- kode lengkap yang relevan.
- alasan kode dibuat.
- hubungan antar file.
- cara menjalankan.
- cara testing.
- contoh request/response.

Jangan langsung menghasilkan seluruh project tanpa penjelasan.

## Coding Principles

### 1. Scope Discipline

Jangan menambahkan fitur yang belum ada di requirements hanya karena umum ditemukan pada WMS/ERP.

### 2. Business Logic di Backend

Frontend tidak menjadi sumber kebenaran untuk quantity stock.

### 3. Database Transaction

Semua stock mutation harus atomic.

### 4. Soft Delete

Master data historis tidak di-hard-delete secara sembarangan.

### 5. Validation

Validation dilakukan menggunakan Zod dan juga diperkuat oleh constraint database.

### 6. Type Safety

Hindari `any` jika generated Prisma types dapat digunakan.

### 7. Naming Consistency

Pilih satu standar dan konsisten antara:

- request field.
- Prisma field.
- API response.
- query parameter.

Contoh query Product direkomendasikan menggunakan `categoryId` bila backend service juga menggunakan `categoryId`.

### 8. Update Partial Data

Schema update jangan memberi default `true` pada `is_active` karena update parsial dapat mengaktifkan kembali record tanpa sengaja.

Gunakan konsep:

```ts
is_active: z.boolean().optional()
```

sedangkan default `true` cukup pada create schema.

### 9. FormData Boolean

Untuk multipart/form-data, jangan mengandalkan `z.coerce.boolean()` untuk nilai string seperti `"false"`, karena hasil coercion dapat tidak sesuai ekspektasi. Gunakan preprocessing boolean yang eksplisit.

### 10. Testing

Gunakan request `.http` untuk menguji endpoint secara bertahap.

Contoh folder:

```text
request/
├── auth.http
├── users.http
├── categories.http
├── suppliers.http
├── warehouses.http
├── products.http
├── inventory.http
└── stock.http
```

## Backend Freeze Checklist

Sebelum frontend dianggap siap terintegrasi:

- Auth dan authorization stabil.
- Master data stabil.
- Product relation update stabil.
- Inventory read-only.
- Stock In berhasil.
- Stock Out berhasil dan memvalidasi sufficient stock.
- Adjustment berhasil.
- Stock Movement tersedia.
- Semua mutation stock atomic.
- Duplicate protection aktif.
- Soft-delete/deactivation policy jelas.
- Concurrency handling sudah diputuskan.
- Request `.http` berhasil.
- Response contract stabil.
