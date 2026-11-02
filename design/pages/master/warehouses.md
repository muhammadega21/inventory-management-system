# Warehouses Page

**Route**: `/warehouses`  
**Component**: `client/src/pages/master/WarehousePage.tsx`  
**Icon**: Warehouse

## Overview

Warehouse location management with codes, addresses, capacity, and active status.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Warehouses                        [Search] [+ Add Warehouse] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┬──────────┬──────────┬──────────┬────────┬────────┐ │
│  │ Code │ Name     │ City     │ Address  │Active  │Actions │ │
│  ├──────┼──────────┼──────────┼──────────┼────────┼────────┤ │
│  │ WH001│ Main WH  │ Jakarta  │ Jl. ...  │   ✓    │Edit Del│ │
│  │ WH002│ Branch A │ Bandung  │ Jl. ...  │   ✓    │Edit Del│ │
│  └──────┴──────────┴──────────┴──────────┴────────┴────────┘ │
│                                                               │
│  Showing 1-10 of 12                           [◄ 1 2 ►]    │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Table Columns

| Column | Width | Content |
|--------|-------|---------|
| Code | 10% | Unique warehouse code |
| Name | 20% | Warehouse name |
| City | 15% | City/location |
| Address | 30% | Full address (truncated) |
| Stock Items | 12% | Number of inventory records |
| Active | 8% | Status badge |
| Actions | 12% | Edit, Delete, View inventory |

### Modal Fields

- `code` (text, required, unique)
- `name` (text, required)
- `city` (text, required)
- `address` (textarea, required)
- `is_active` (boolean, default true)

### Actions

- Add warehouse
- Edit warehouse
- Delete warehouse (blocked with inventory)
- View warehouse inventory (`/inventories?warehouseId=:id`)

## Data Management

```typescript
GET /api/warehouses?page=1&limit=10&search=
GET /api/warehouses/:id
POST /api/warehouses
PUT /api/warehouses/:id
DELETE /api/warehouses/:id
GET /api/warehouses/:id/inventory
```

## States

- Loading skeleton
- Empty state with create CTA
- Error alert with retry
- Success toast after mutations

## Responsive Behavior

- Desktop: Full table
- Tablet: Hide address or truncate
- Mobile: Card view with address expansion
