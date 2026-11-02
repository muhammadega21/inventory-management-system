# Inventory Page

**Route**: `/inventories`  
**Component**: `client/src/pages/main/InventoryPage.tsx`  
**Icon**: Layers

## Overview

Current stock levels across all warehouses with multi-warehouse view and low stock alerts.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Inventory                         [Search] [Filter] [View] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Warehouse: [All ▼]  Category: [All ▼]  Status: [All ▼]   │
│                                                               │
│  ┌─────┬──────────┬──────┬────────┬────────┬────────────┐  │
│  │SKU  │ Product  │Cat.  │Minimum │Current │ Status     │  │
│  ├─────┼──────────┼──────┼────────┼────────┼────────────┤  │
│  │P001 │Prod1-WH1 │Elec. │   100  │  150   │ ✓ OK       │  │
│  │P001 │Prod1-WH2 │Elec. │   100  │   50   │ ⚠ Low      │  │
│  │P002 │Prod2-WH1 │Hard. │    50  │    0   │ ✗ Stockout │  │
│  └─────┴──────────┴──────┴────────┴────────┴────────────┘  │
│                                                               │
│  Showing 1-20 of 120                      [◄ 1 2 3 ►]     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Warehouse Filter

- All warehouses (consolidated view)
- Individual warehouse selection
- Quantity grouped by warehouse

### Status Indicators

- **Green (✓)**: Stock > Minimum
- **Orange (⚠)**: Stock <= Minimum
- **Red (✗)**: Stock = 0
- **Gray**: Inactive product

### Table Columns

| Column | Width | Type | Content |
|--------|-------|------|---------|
| SKU | 10% | Text | Product SKU |
| Product | 20% | Text | Product name |
| Category | 12% | Text | Category name |
| Warehouse | 15% | Text | Warehouse name (if filtered by warehouse) |
| Minimum | 12% | Number | Minimum stock threshold |
| Current | 12% | Number | Current stock quantity |
| Status | 15% | Badge | Status with icon |
| Actions | 4% | Menu | View details, adjust stock |

### Search

**Fields**: SKU, Product name, Category

### Filters

1. **Warehouse Filter**
   - All warehouses
   - Individual warehouse select

2. **Status Filter**
   - All
   - In stock
   - Low stock
   - Out of stock

3. **Category Filter**
   - All categories
   - Individual categories

### Actions

**View Details**
- Product inventory detail page
- Stock movement history
- Warehouse breakdown

**Adjust Stock** (Future)
- Quick adjustment modal
- Stock count verification
- Adjustment reason

## View Modes

### Consolidated View (Default)
Shows all products with total quantity across warehouses.

```
| SKU | Product | Total Qty | Min | Status |
|----|---------|-----------|-----|--------|
```

### Warehouse Detail View
Shows products for specific warehouse.

```
| SKU | Product | Qty | Min | Status |
|-------|---------|------|------|--------|
```

### Warehouse Comparison View (Future)
Compare same product across warehouses.

```
| Product | WH1 | WH2 | WH3 | Total |
|---------|-----|-----|-----|-------|
```

## Summary Cards (Top)

**Optional Dashboard**:
- Total products in inventory
- Low stock products count
- Out of stock products count
- Total quantity in stock

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Products │ │   Low    │ │  Out of  │ │  Total   │
│  Stock   │ │  Stock   │ │  Stock   │ │ Quantity │
│   245    │ │    12    │ │     5    │ │  50,230  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

## Data Management

### API Endpoints

```typescript
// Get inventory with filters
GET /api/inventories?warehouseId=1&categoryId=1&status=low&page=1&limit=20

// Get inventory details for product
GET /api/inventories/product/:id

// Get warehouse inventory summary
GET /api/warehouses/:id/inventory

// Adjust stock (future)
POST /api/inventories/:id/adjust
Body: {
  quantity: number;
  reason: string;
  notes?: string;
}
```

### Types

```typescript
interface Inventory {
  id: number;
  product: ProductListItem;
  warehouse: Warehouse;
  quantity: number;
  minimumStock: number;
  status: "ok" | "low" | "stockout";
  lastAdjustedAt: string;
}
```

### Hooks

- `useInventories()` - List inventory
- `useInventoryByProduct()` - Product inventory details

## Responsive Behavior

### Desktop (lg+)
- Full table view
- Warehouse filter dropdown
- Inline actions

### Tablet (md)
- Simplified table (hide Warehouse if "All")
- Collapsible filters
- Action menu

### Mobile (sm)
- Card view
- Stack columns
- Status badges prominent
- Action buttons in card

## States

- **Loading**: Skeleton rows
- **Error**: Error alert with retry
- **Empty**: "No inventory data"
- **No Filter Results**: "No products match filters"

## Performance

- Pagination (not infinite scroll)
- Lazy load details
- Query caching

## Future Enhancements

- Stock adjustment workflow
- Barcode scanning
- Cycle count reconciliation
- Inventory forecast
- Stock transfer between warehouses
- Reorder point alerts
- ABC analysis
