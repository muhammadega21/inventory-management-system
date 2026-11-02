# 06 – Frontend Architecture

## Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- TanStack Query
- Tailwind CSS
- UI/component library bila diperlukan
- SweetAlert2 bila diperlukan untuk confirmation/feedback
- Lucide React

## Struktur

```text
client/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── utils/
│   └── main.tsx
├── public/
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Responsibility Frontend

Frontend bertanggung jawab terhadap:

- UI.
- Form.
- Routing.
- UI state.
- API fetching.
- Loading/error/empty state.
- Auth state.
- Table.
- Pagination.
- Filtering.
- Searching.
- Dashboard visualization.

Business logic inventory tetap berada di backend.

## TanStack Query

Server state utama:

```text
products
categories
suppliers
warehouses
inventory
stock movements
users
reports
```

## Stock UI

### Stock In

Form minimal:

```text
Warehouse
Supplier (optional)
Transaction date (optional bila backend default now)
Notes
Items[]
```

### Stock Out

Form minimal:

```text
Warehouse
Transaction date
Notes
Items[]
```

### Adjustment

Form harus menampilkan setidaknya:

```text
Product
System stock
Physical stock
Difference
```

User tidak boleh dipaksa menghitung difference secara manual jika backend dapat menghitungnya.
