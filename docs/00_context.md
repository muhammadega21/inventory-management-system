# StockFlow – Project Context

> **Source of truth:** dokumen ini menjadi index utama. Detail dipisahkan ke file lain agar mudah dibaca dan dipelihara.

## Tujuan Project

StockFlow adalah **Inventory Management System (IMS)** untuk mengelola produk, stok, transaksi stok, dan histori pergerakan stok pada beberapa warehouse.

Project ini dibuat sebagai portfolio sekaligus latihan full-stack, dengan fokus utama pada **inventory business logic**, bukan sekadar CRUD.

## Prinsip Scope

StockFlow dibuat sebagai **IMS yang realistis dan maintainable**, bukan full WMS/ERP. Fitur seperti purchase order, batch/lot, bin/bay, gate pass, barcode scanning, approval workflow, valuation, reserved stock, SLA, dan fitur enterprise lain berada di luar scope inti sampai dikonfirmasi kembali.

## Struktur Dokumen

- `01_requirements.md` — tujuan, modul, scope, dan role.
- `02_database.md` — konsep database dan aturan relasi.
- `03_inventory_logic.md` — aturan Stock In, Stock Out, Adjustment, Inventory, Movement.
- `04_api.md` — daftar endpoint dan aturan API.
- `05_backend_architecture.md` — struktur backend dan pola request.
- `06_frontend_architecture.md` — struktur dan tanggung jawab frontend.
- `07_auth_authorization.md` — authentication, authorization, session, dan security rules.
- `08_file_upload.md` — Cloudinary dan aturan image upload.
- `09_development_rules.md` — urutan pengembangan dan aturan coding.
- `10_current_decisions.md` — keputusan implementasi terbaru dan hal yang sudah disepakati.

## Stack Utama

- Backend: Node.js, Express.js, TypeScript, Prisma, PostgreSQL, Zod.
- Auth: JWT + HTTP-only Cookie.
- Storage: Cloudinary.
- Documentation: OpenAPI/Swagger.
- Frontend: React, TypeScript, Vite, React Router, Axios, TanStack Query, Tailwind CSS.

## Alur Umum

```text
React
  ↓ HTTP / REST API
Node.js + Express
  ↓
Controllers → Services → Prisma
  ↓
PostgreSQL
```

Untuk gambar:

```text
React → Express API → Cloudinary
                    ↓
                 image URL / identifier
                    ↓
                PostgreSQL
```

## Source of Truth

Pisahkan dua hal berikut:

1. **Requirements/business rules** — apa yang harus dilakukan aplikasi.
2. **Current implementation decisions** — bagaimana requirement tersebut saat ini diimplementasikan.

Jika keduanya berbeda, jangan diam-diam mengubah requirement. Catat perbedaannya di `10_current_decisions.md`.
