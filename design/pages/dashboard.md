# Dashboard Page

**Route**: `/`  
**Component**: `client/src/pages/main/DashboardPage.tsx`  
**Icon**: LayoutDashboard

## Overview

Main landing page showing inventory overview, key metrics, and quick actions.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                     [Date Range]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Active  │ │   Low    │ │ Stock    │ │ Inactive │      │
│  │ Products │ │  Stock   │ │   Out    │ │ Products │      │
│  │   150    │ │    12    │ │     5    │ │    10    │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                               │
│  ┌───────────────────────────┐ ┌────────────────────────┐  │
│  │                           │ │                        │  │
│  │   Stock Movement Chart    │ │   Low Stock Products   │  │
│  │   (Last 30 Days)          │ │   - Product A          │  │
│  │                           │ │   - Product B          │  │
│  │   [Line Chart]            │ │   - Product C          │  │
│  │                           │ │                        │  │
│  └───────────────────────────┘ └────────────────────────┘  │
│                                                               │
│  ┌───────────────────────────┐ ┌────────────────────────┐  │
│  │                           │ │                        │  │
│  │   Recent Transactions     │ │   Warehouse Stock      │  │
│  │   - Transaction #001      │ │   - Warehouse A: 500   │  │
│  │   - Transaction #002      │ │   - Warehouse B: 350   │  │
│  │   - Transaction #003      │ │   - Warehouse C: 200   │  │
│  │                           │ │                        │  │
│  └───────────────────────────┘ └────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Widgets

### Summary Cards (4 Cards)

**Grid**: 4 columns (responsive: 1 col mobile, 2 col tablet, 4 col desktop)

1. **Active Products**
   - Count of active products
   - Green icon (Package)
   - Link to Products page

2. **Low Stock**
   - Count of products below minimum stock
   - Orange icon (AlertTriangle)
   - Link to filtered Products page

3. **Stock Out**
   - Count of products with zero stock
   - Red icon (XCircle)
   - Link to filtered Products page

4. **Inactive Products**
   - Count of inactive products
   - Gray icon (Archive)
   - Link to Products page

**Card Structure**:
```tsx
<div className="stats shadow">
  <div className="stat">
    <div className="stat-figure text-primary">
      <Package size={32} />
    </div>
    <div className="stat-title">Active Products</div>
    <div className="stat-value">150</div>
    <div className="stat-desc">Total active products</div>
  </div>
</div>
```

### Stock Movement Chart

**Type**: Line chart (Chart.js or Recharts)  
**Period**: Last 30 days  
**Data**: Daily IN/OUT/ADJUSTMENT totals

**Metrics**:
- Stock In (Green line)
- Stock Out (Red line)
- Net Change (Blue line)

**Interactions**:
- Hover tooltips
- Date range selector
- Legend toggle

### Low Stock Products

**Type**: Alert list  
**Display**: Top 10 products below minimum stock

**Columns**:
- Product name
- Current stock
- Minimum stock
- Warehouse
- Action button (Quick restock)

**Empty State**: "All products are well-stocked"

### Recent Transactions

**Type**: Transaction list  
**Display**: Latest 10 stock transactions

**Columns**:
- Transaction number
- Type (IN/OUT/ADJUSTMENT)
- Product name
- Quantity
- Date
- User

**Action**: View details link

### Warehouse Stock

**Type**: Summary cards or bar chart  
**Display**: Total stock per warehouse

**Data**:
- Warehouse name
- Total products
- Total quantity
- Utilization percentage

**Action**: View warehouse details

## Data Sources

### API Endpoints

```typescript
// Product summary
GET /api/products/summary
Response: {
  activeProducts: number;
  lowStock: number;
  stockout: number;
  inactiveProducts: number;
}

// Stock movements chart
GET /api/stock-movements/stats?period=30d
Response: {
  date: string;
  stockIn: number;
  stockOut: number;
  adjustment: number;
}[]

// Low stock products
GET /api/products?lowStock=true&limit=10
Response: ProductListItem[]

// Recent transactions
GET /api/stock-transactions?limit=10&sortBy=date&sortOrder=desc
Response: StockTransaction[]

// Warehouse stock
GET /api/warehouses/stock
Response: {
  warehouseId: number;
  warehouseName: string;
  totalProducts: number;
  totalQuantity: number;
}[]
```

## Interactions

### Refresh Data

- Auto-refresh every 5 minutes
- Manual refresh button
- Loading states on refresh

### Quick Actions

- **Add Product**: Opens ModalProduct
- **Record Transaction**: Opens StockMovementPage
- **View Reports**: Navigate to ReportPage

### Filters

- Date range selector (Last 7 days, 30 days, 90 days, Custom)
- Warehouse filter (All, specific warehouse)

## Responsive Behavior

### Desktop (lg+)
- 4-column summary cards
- 2-column layout for charts and lists
- All widgets visible

### Tablet (md)
- 2-column summary cards
- Single column charts and lists
- Scrollable lists

### Mobile (sm)
- Single column layout
- Simplified cards
- Collapsed charts with expand option

## States

### Loading
- Skeleton loaders for cards
- Spinner for charts
- Shimmer effect

### Error
- Error alert with retry button
- Partial data display if some widgets fail

### Empty
- Friendly message when no data
- Quick action buttons to add data

## Performance

### Optimization
- React Query caching (5 min stale time)
- Lazy load chart libraries
- Virtualized lists for large data
- Debounced filter changes

### Metrics
- Initial load: < 2s
- Chart render: < 500ms
- Refresh: < 1s

## Future Enhancements

- Real-time updates (WebSocket)
- Customizable dashboard widgets
- Export dashboard as PDF
- Widget drag-and-drop
- Personal dashboard preferences
- Notifications panel
