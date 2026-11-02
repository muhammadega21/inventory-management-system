# 10 – Current Decisions & Implementation Notes

Dokumen ini berisi keputusan implementasi terbaru agar tidak tercampur dengan requirement awal.

## 1. Staff Melihat Semua Warehouse

Semua STAFF dapat melihat semua warehouse.

Tidak perlu membatasi warehouse berdasarkan user.

Jika ada relasi `UserWarehouse` dari implementasi lama tetapi requirement tidak lagi memerlukannya, jangan gunakan relasi tersebut untuk membatasi visibility tanpa keputusan baru.

## 2. Inventory Read-Only

Inventory tidak memiliki endpoint normal untuk:

```text
POST /inventory
PATCH /inventory/:id
DELETE /inventory/:id
```

Inventory dibuat/diperbarui hanya oleh Stock In, Stock Out, dan Adjustment.

## 3. Inventory Minimum Stock

Threshold minimum stock berada pada Product.

Jangan menggandakan `minimum_stock` di Inventory kecuali kebutuhan threshold per warehouse memang dikonfirmasi.

## 4. Inventory Bin Location

`bin_location` bukan bagian dari scope inti saat ini.

Jangan menambahkan kembali hanya karena umum pada WMS.

## 5. Product Price

Harga Product bukan requirement core IMS saat ini.

Karena itu `unit_price` pada Product atau StockTransactionItem jangan dianggap wajib kecuali pricing/accounting secara eksplisit ditambahkan.

## 6. Adjustment Physical Quantity

Untuk Adjustment, penggunaan `physical_quantity` pada StockTransactionItem direkomendasikan.

Semantik:

```text
quantity = physical_quantity - system stock
```

Jika service menggunakan `physical_quantity`, field tersebut harus benar-benar ada pada Prisma schema dan migration. Jangan menyimpan `physical_quantity: null` pada Stock In/Out jika field tersebut tidak dibutuhkan untuk jenis transaksi tersebut.

## 7. Stock Movement Transaction Relation

Setiap StockMovement harus mereferensikan StockTransaction yang membuatnya.

Field database dapat berupa nama seperti `stocktransactionId` sesuai schema saat ini, tetapi relation field Prisma harus digunakan berdasarkan **nama relation field yang benar-benar dihasilkan Prisma Client**.

Contoh error yang pernah terjadi:

```text
Unknown field `user` for select statement on model `StockTransaction`.
Available: User, Warehouse, Supplier, StockTransactionItem, movements...
```

Artinya query harus mengikuti nama relation Prisma yang sebenarnya, misalnya `User`, bukan mengasumsikan `user`.

Prinsip: **ikuti generated Prisma Client, bukan asumsi casing.**

## 8. Stock Movement API

Endpoint yang disepakati:

```text
GET /api/stock/movements
GET /api/stock/movements/:id
```

Filter utama:

```text
search
warehouseId
productId
type
dateFrom
dateTo
sortBy
sortOrder
pagination
```

## 9. Transaction Status

Jika schema masih menggunakan:

```text
DRAFT
POSTED
CANCELLED
```

tetapi implementasi core saat ini selalu membuat transaction sebagai `POSTED`, status tersebut sebaiknya diperlakukan sebagai future workflow sampai draft/cancel benar-benar memiliki business logic.

Jangan menambahkan endpoint draft/cancel hanya karena enum sudah tersedia.

## 10. Generator Code

Generator lama berbasis:

```text
find last record → +1
```

diganti dengan PostgreSQL sequence untuk mengurangi race condition.

Format saat ini:

```text
Supplier  → VND-00001
Warehouse → WH-00001
Product   → PROD-00001
```

Tetap pertahankan unique constraint pada code/SKU.

## 11. Product Update Category

Prisma relation update menggunakan syntax relation jika generated `ProductUpdateInput` tidak menyediakan scalar `categoryId` update secara langsung.

Contoh:

```ts
updateData.category = {
  connect: { id: data.category_id },
};
```

## 12. Product Response

Product API dapat mengembalikan Category nested agar frontend tidak perlu request category terpisah untuk setiap Product.

Contoh konsep:

```ts
category: {
  select: {
    id: true,
    name: true,
    description: true,
    is_active: true,
  },
}
```

## 13. Product Deactivation

Deactivation Product/Warehouse ketika masih memiliki stock aktif harus memiliki policy yang jelas.

Rekomendasi saat ini: blok deactivation jika stock > 0, karena transaksi stock berikutnya memerlukan master data aktif.

## 14. Last Active ADMIN

Sistem tidak boleh membuat kondisi tanpa active ADMIN.

Karena itu, deactivation atau perubahan role ADMIN terakhir harus ditolak bila akan menghilangkan satu-satunya active ADMIN.

## 15. Refresh Token

Jika refresh token di database disimpan dalam bentuk hash, lookup refresh token dari cookie harus menggunakan hash yang sama, bukan raw token.

## 16. Current Readiness

Backend core dianggap **mendekati freeze**, tetapi belum otomatis dianggap production-ready sampai checklist berikut selesai:

```text
[ ] physical_quantity sinkron dengan Prisma schema
[ ] update is_active aman terhadap partial update
[ ] FormData boolean aman
[ ] deactivation dengan stock memiliki policy
[ ] last active ADMIN terlindungi
[ ] Stock Movement API selesai dan relation names benar
[ ] semua stock flow diuji
[ ] concurrency handling diputuskan
[ ] response contract dibekukan
```

Setelah item-item tersebut beres, frontend React dapat mulai diintegrasikan tanpa mengubah kontrak core secara besar.
