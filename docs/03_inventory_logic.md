# 03 – Inventory Business Logic

## Prinsip

Semua proses yang mengubah stock harus dijalankan di dalam **database transaction**.

```text
StockTransaction
      ↓
StockTransactionItem
      ↓
Inventory
      ↓
StockMovement
```

Jika salah satu proses gagal, seluruh perubahan harus rollback.

## Stock In

Flow:

```text
Validate warehouse
      ↓
Validate optional supplier
      ↓
Validate products
      ↓
Validate duplicate products in request
      ↓
Create StockTransaction
      ↓
Create StockTransactionItem
      ↓
Create/update Inventory
      ↓
Create StockMovement
```

Perhitungan:

```text
before = current inventory quantity
after  = before + incoming quantity
movement.quantity = +incoming quantity
```

Jika Inventory row belum ada, buat row baru dengan quantity sebesar incoming quantity.

## Stock Out

Flow sama seperti Stock In, tetapi wajib memeriksa:

```text
current stock >= requested quantity
```

Perhitungan:

```text
before = current stock
after  = before - requested quantity
movement.quantity = -requested quantity
```

Jika stock tidak cukup, request harus gagal dan tidak boleh meninggalkan perubahan parsial.

## Stock Adjustment

Adjustment mencocokkan current stock sistem dengan physical count.

Contoh:

```text
System stock  = 120
Physical stock = 117
```

Maka:

```text
before = 120
after = 117
difference = -3
```

Movement menyimpan:

```text
quantity_before = 120
quantity = -3
quantity_after = 117
```

`StockTransactionItem.physical_quantity = 117` bila field tersebut digunakan.

## Contoh Urutan Stock

```text
Initial = 100

Stock In +50
→ 150

Stock Out 30
→ 120

Adjustment physical = 117
→ 117
```

Movement history:

```text
100 → +50 → 150
150 → -30 → 120
120 → -3  → 117
```

## Read Model vs Write Model

Inventory adalah current state.

Stock Movement adalah historical record.

Jangan melakukan perubahan stock langsung melalui endpoint Inventory seperti:

```text
PATCH /inventory/:id
DELETE /inventory/:id
```

Perubahan harus dilakukan melalui domain transaction:

```text
POST /stock/in
POST /stock/out
POST /stock/adjustment
```

## Concurrency

Perhitungan `before` → `after` harus aman terhadap dua transaksi yang berjalan bersamaan. Sebelum backend dianggap production-ready, gunakan transaction isolation/locking atau strategi concurrency yang memastikan dua request tidak menimpa quantity satu sama lain.

## Deactivation dengan Stock

Jangan menonaktifkan Product atau Warehouse yang masih memiliki stock aktif tanpa policy yang jelas. Jika master dibuat inactive sementara stock masih ada, Stock In/Out/Adjustment dapat menjadi buntu.

Policy yang direkomendasikan: blok deactivation ketika masih ada stock > 0, atau sediakan business rule khusus untuk handling stock tersebut.
