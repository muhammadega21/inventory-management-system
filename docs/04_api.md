# 04 – API Specification

Base path:

```text
/api
```

## Auth

```text
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

## Users

```text
GET    /api/users
GET    /api/users/:id
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

Authorization dan aturan last-active-admin wajib diterapkan di backend.

## Categories

```text
GET    /api/categories
GET    /api/categories/:id
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

## Suppliers

```text
GET    /api/suppliers
GET    /api/suppliers/:id
POST   /api/suppliers
PUT    /api/suppliers/:id
DELETE /api/suppliers/:id
```

## Warehouses

```text
GET    /api/warehouses
GET    /api/warehouses/:id
POST   /api/warehouses
PUT    /api/warehouses/:id
DELETE /api/warehouses/:id
```

Semua staff dapat melihat semua warehouse.

## Products

```text
GET    /api/products
GET    /api/products/:id
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Query umum:

```text
?page=1
&perPage=10
&search=laptop
&categoryId=1
&is_active=true
&sortBy=name
&sortOrder=asc
```

## Inventory

```text
GET /api/inventory
GET /api/inventory/:id
```

Inventory bersifat read-only terhadap perubahan quantity.

## Stock

```text
POST /api/stock/in
POST /api/stock/out
POST /api/stock/adjustment
```

## Stock Movement

```text
GET /api/stock/movements
GET /api/stock/movements/:id
```

Query movement dapat mendukung:

```text
page
limit / perPage
search
warehouseId
productId
type
dateFrom
dateTo
sortBy
sortOrder
```

Search dapat mencakup product name/SKU, warehouse name/code, dan transaction number.

## Reports

```text
/api/reports/*
```

Reports tetap fokus pada inventory dan stock activity. Valuation/money reporting bukan bagian dari core scope kecuali dikonfirmasi.

## Response Format

Success:

```json
{
  "success": true,
  "message": "Product berhasil ditemukan",
  "data": {}
}
```

Pagination:

```json
{
  "success": true,
  "message": "Products berhasil ditemukan",
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

Error:

```json
{
  "success": false,
  "message": "Product tidak ditemukan",
  "errors": null
}
```

Validation error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name wajib diisi",
    "sku": "SKU sudah digunakan"
  }
}
```

Gunakan helper seperti `sendSuccess()` dan `sendError()` agar format konsisten.
