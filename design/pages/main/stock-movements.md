# Stock Movement Page

**Route**: `/stock-movements`  
**Component**: `client/src/pages/main/StockMovementPage.tsx`  
**Icon**: ArrowLeftRight

## Overview

Stock transaction history with filtering, search, and detailed view of all incoming, outgoing, and adjustment transactions.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Stock Movements                [Search] [Filter] [+ Record] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Type: [All ▼]  Warehouse: [All ▼]  Date: [All ▼]         │
│                                                               │
│  ┌──────────┬──────┬───────┬───────┬────────┬────────────┐ │
│  │ Trans ID │ Type │Qty    │Product│Ware.   │ Date       │ │
│  ├──────────┼──────┼───────┼───────┼────────┼────────────┤ │
│  │ TXN-0001 │  IN  │ +100  │Prod1  │ WH-A   │ 02 Nov 14:30
│  │ TXN-0002 │ OUT  │  -50  │Prod2  │ WH-B   │ 02 Nov 13:15
│  │ TXN-0003 │ ADJ  │  +10  │Prod3  │ WH-C   │ 01 Nov 10:45
│  └──────────┴──────┴───────┴───────┴────────┴────────────┘ │
│                                                               │
│  Showing 1-20 of 350                      [◄ 1 2 3 ►]     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Transaction Types

1. **IN (Incoming)**
   - Supplier purchase
   - Returns from customer
   - Transfers in
   - Icon: ArrowRight (Green)

2. **OUT (Outgoing)**
   - Sales/shipments
   - Transfers out
   - Returns to supplier
   - Icon: ArrowLeft (Red)

3. **ADJUSTMENT (Adjustment)**
   - Inventory count correction
   - Damage/loss write-off
   - Icon: RotateCw (Orange)

### Table Columns

| Column | Width | Type | Content |
|--------|-------|------|---------|
| Trans ID | 12% | Text | Transaction number (sortable) |
| Type | 10% | Badge | IN/OUT/ADJUSTMENT with color |
| Quantity | 10% | Number | Change quantity with +/- |
| Product | 18% | Text | Product name and SKU |
| Category | 12% | Text | Product category |
| Warehouse | 12% | Text | Warehouse name |
| User | 10% | Text | Transaction user |
| Date | 12% | DateTime | Transaction date/time (sortable) |
| Actions | 4% | Menu | View details |

### Filters

1. **Type Filter**
   - All
   - Stock In
   - Stock Out
   - Adjustment

2. **Warehouse Filter**
   - All warehouses
   - Specific warehouse

3. **Date Range Filter**
   - Last 7 days
   - Last 30 days
   - Last 90 days
   - Custom range

4. **Product Filter**
   - By product name
   - By SKU
   - By category

### Search

**Fields**:
- Transaction number
- Product name/SKU
- Warehouse name
- User name

**Behavior**: Debounced 300ms

### Actions

**View Details**
- Opens transaction detail modal
- Shows full transaction info
- Related transactions
- Stock before/after

**Sort**
- Click column header to sort
- Transaction ID, Date default sorts

## Summary Cards (Optional Top)

```
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Total IN │ │ Total    │ │ Adj.     │
│          │ │ OUT      │ │ Count    │
│  +2,450  │ │  -1,850  │ │    +120  │
└──────────┘ └──────────┘ └──────────┘
```

**Period**: Selectable (Today, This week, This month)

## Transaction Detail Modal

**Content**:
- Transaction number
- Type with color badge
- Date and time
- User who recorded
- Product details
- Quantity (Before/After)
- Warehouse
- Related document (PO, SO)
- Notes

**Actions**:
- Print transaction
- Export as PDF
- Close

## Data Management

### API Endpoints

```typescript
// List stock movements
GET /api/stock-movements?type=IN&warehouseId=1&dateFrom=2026-01-01&dateTo=2026-12-31&page=1&limit=20

// Get movement details
GET /api/stock-movements/:id

// Create stock movement
POST /api/stock-movements
Body: {
  type: "IN" | "OUT" | "ADJUSTMENT";
  productId: number;
  warehouseId: number;
  quantity: number;
  notes?: string;
  relatedDocumentId?: number;
}

// Get summary stats
GET /api/stock-movements/summary?dateFrom=2026-01-01&dateTo=2026-12-31
```

### Types

```typescript
type StockType = "IN" | "OUT" | "ADJUSTMENT";

interface StockMovement {
  id: number;
  type: StockType;
  quantity: number;
  quantityBefore: number;
  quantityAfter: number;
  product: ProductListItem;
  warehouse: Warehouse;
  user: User;
  notes?: string;
  createdAt: string;
}
```

### Hooks

- `useStockMovements()` - List movements
- `useStockMovementById()` - Detail view
- `useCreateStockMovement()` - Create transaction (future)

## Responsive Behavior

### Desktop (lg+)
- Full table with all columns
- Inline action buttons
- Modal details

### Tablet (md)
- Hide Category, User columns
- Collapse actions to menu
- Drawer modal

### Mobile (sm)
- Card view
- Stacked info
- Full-screen modal

## States

- **Loading**: Skeleton rows
- **Error**: Error alert
- **Empty**: "No transactions"
- **No Results**: "No transactions match filters"

## Performance

- Pagination (default 20 items)
- Date range query optimization
- Query caching (stale: 1 min)

## Sort Options

| Column | Default | Reverse |
|--------|---------|---------|
| Trans ID | A-Z | Z-A |
| Type | IN > OUT > ADJ | ADJ > OUT > IN |
| Date | Newest first | Oldest first |
| Product | A-Z | Z-A |

## Future Enhancements

- Bulk operations (mark as verified, print batch)
- Stock movement reports
- Transaction approval workflow (for high-value)
- Barcode scanning for OUT transactions
- Mobile scan app integration
- Stock count verification
- Recurring transactions
- Transaction reconciliation
