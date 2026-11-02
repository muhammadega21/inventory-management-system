# 01 – Requirements & Scope

## Gambaran Aplikasi

StockFlow mengelola barang dan pergerakan stok pada beberapa warehouse. Tujuan utamanya adalah memastikan current stock setiap product dapat diketahui berdasarkan transaksi yang terjadi.

## Modul Utama

```text
Authentication
User Management
Category Management
Product Management
Supplier Management
Warehouse Management
Inventory
Stock In
Stock Out
Stock Adjustment
Stock Movement / History
Dashboard
Reports sederhana
```

## Role

Hanya ada dua role:

```text
ADMIN
STAFF
```

### ADMIN

Memiliki akses penuh terhadap modul yang tersedia.

### STAFF

Berfokus pada operasional inventory:

- Melihat product, supplier, warehouse, inventory.
- Stock In.
- Stock Out.
- Stock Movement / History.
- Stock Adjustment sesuai business rule yang diterapkan.

### Warehouse Visibility

Semua STAFF dapat melihat semua warehouse. Sistem **tidak menggunakan pembatasan warehouse per user** untuk visibility saat ini.

Authorization tetap wajib dilakukan di backend.

## Master Data

Master data utama:

- Users
- Categories
- Products
- Suppliers
- Warehouses

Master data menggunakan soft-delete/deactivation melalui `is_active`.

## Scope yang Tidak Menjadi Fitur Inti

Jangan menambahkan fitur berikut hanya berdasarkan asumsi:

- Purchase Order.
- Batch / Lot / Expiry.
- Bin / Bay / lokasi rak detail.
- Gate Pass.
- Transfer workflow khusus.
- Approval workflow.
- Stock reservation.
- Inventory valuation.
- Reorder automation.
- Lead time / SLA.
- 2FA atau audit terminal/IP sebagai requirement inti.
- Barcode scanning sebagai workflow inti.
- Product pricing/accounting sebagai bagian inti inventory.

Fitur tersebut dapat menjadi future scope setelah core IMS stabil.

## Prinsip Utama

StockFlow harus tetap sederhana secara domain, tetapi kuat pada konsistensi data stok, histori, validasi, dan auditability.
