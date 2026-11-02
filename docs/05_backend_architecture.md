# 05 – Backend Architecture

## Struktur

Gunakan struktur REST API yang familiar dan mudah dipelihara:

```text
server/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── services/
│   ├── schemas/
│   ├── utils/
│   ├── lib/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── generated/
├── request/
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

Jika project kemudian menggunakan struktur per-feature/module, tetap pertahankan pemisahan tanggung jawab yang sama.

## Request Flow

```text
Request
  ↓
Route
  ↓
Authentication / Authorization middleware
  ↓
Validation
  ↓
Controller
  ↓
Service
  ↓
Prisma
  ↓
PostgreSQL
```

## Responsibility

### Route

- Menentukan endpoint.
- Memasang middleware.
- Memanggil controller.

### Middleware

- Authentication.
- Authorization.
- CSRF untuk endpoint mutasi bila policy menggunakannya.
- Error handling.
- Upload handling bila diperlukan.

### Schema

Zod digunakan untuk memvalidasi request.

### Controller

- Membaca request.
- Memanggil service.
- Membentuk response.

Controller tidak boleh berisi inventory business logic yang panjang.

### Service

Menangani business logic dan operasi database yang berhubungan dengan domain.

## Prisma

Jangan mencampur istilah:

- `prisma/schema.prisma` = database schema/model.
- `src/schemas/*.schema.ts` = request validation schema.

Nama relation Prisma harus konsisten dengan generated client. Contoh: jika relation field di Prisma bernama `User`, jangan mengaksesnya sebagai `user` di `select`.

## Type Safety

Hindari:

```ts
const where: any = {};
const orderBy: any = {};
```

Gunakan Prisma generated types jika memungkinkan.

## Code Generator

Generator Product SKU, Supplier Code, dan Warehouse Code menggunakan PostgreSQL sequence, bukan pola `find-last + 1`.

Contoh format:

```text
VND-00001
WH-00001
PROD-00001
```

Transaction number menggunakan format yang unik, misalnya:

```text
STK-IN-20261006-XXXXXXXX
```

Unique constraint database tetap menjadi safety net terakhir.
