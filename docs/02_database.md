# 02 – Database Design

## Database

- PostgreSQL
- Prisma ORM

## Model Utama

```text
User
Category
Product
Supplier
Warehouse
Inventory
StockTransaction
StockTransactionItem
StockMovement
RefreshToken
```

## Konsep Model

### User

Menyimpan akun pengguna dan role:

```text
ADMIN | STAFF
```

Field penting:

- id
- role
- name
- email
- password hash
- is_active
- timestamps

### Category

Master category untuk Product.

### Product

Minimal terdiri dari:

- category
- name
- SKU
- optional barcode/EAN jika dipakai
- unit
- minimum_stock
- description
- image
- is_active

**Catatan:** `minimum_stock` berada di Product, bukan Inventory, kecuali suatu saat kebutuhan threshold per warehouse dikonfirmasi.

### Supplier

Master supplier yang terutama digunakan pada Stock In. Supplier pada Stock Transaction bersifat optional.

### Warehouse

Merepresentasikan lokasi penyimpanan.

Field implementasi tambahan seperti `code`, `city`, `address`, atau `capacity` boleh ada pada schema saat ini, tetapi jangan otomatis dianggap sebagai requirement bisnis inti kecuali sudah dipakai oleh fitur.

### Inventory

Inventory adalah **current stock**, bukan histori.

Unique key:

```prisma
@@unique([productId, warehouseId])
```

Artinya satu Product hanya mempunyai satu Inventory row untuk satu Warehouse.

Inventory tidak dibuat sebagai CRUD normal. API utamanya read-only:

```text
GET /api/inventory
GET /api/inventory/:id
```

Perubahan quantity hanya melalui Stock In, Stock Out, atau Adjustment.

Inventory dengan quantity `0` boleh tetap tersimpan. Inventory tidak dihapus hanya karena stock menjadi nol.

### StockTransaction

Mewakili **business transaction**.

Informasi inti:

- transaction number
- type: IN / OUT / ADJUSTMENT
- warehouse
- optional supplier
- user
- transaction date
- notes
- status jika implementation saat ini masih memakai status

### StockTransactionItem

Menyimpan product yang terlibat dalam transaction dan quantity perubahan.

Untuk Adjustment, field `physical_quantity` dapat digunakan untuk menyimpan hasil physical count.

Semantik Adjustment:

```text
quantity = physical_quantity - quantity_before
physical_quantity = stok fisik hasil counting
```

Contoh system stock 100, physical stock 97:

```text
physical_quantity = 97
quantity = -3
```

### StockMovement

Mewakili histori immutable dari perubahan stock.

Minimal:

- product
- warehouse
- stock transaction
- type
- quantity
- quantity_before
- quantity_after
- created_at

`stockTransactionId` wajib terhubung agar movement dapat ditelusuri kembali ke transaksi penyebabnya.

## Foreign Key & Delete Policy

- Product → Category: `Restrict`.
- Inventory → Product: `Restrict`.
- Inventory → Warehouse: `Restrict`.
- Stock history → master/transaction: jangan di-hard-delete secara normal.
- Optional Supplier relation dapat menggunakan `SetNull` bila sesuai schema.
- `Cascade` hanya untuk child yang memang sepenuhnya bergantung pada parent.

## Soft Delete

Master data menggunakan:

```text
is_active = true / false
```

Deactivation tidak boleh menghapus histori.

Jangan menghapus image Cloudinary ketika hanya melakukan deactivation Product.

## Duplicate Safety

Unique constraints harus tetap menjadi lapisan terakhir pencegahan duplikasi, misalnya:

- User.email
- Category.name
- Product.sku
- Product.barcode bila digunakan
- Warehouse.code
- Inventory(productId, warehouseId)
- StockTransaction.transaction_number

Generator kode tidak boleh mengandalkan `findFirst orderBy id desc + 1` karena rentan race condition.
