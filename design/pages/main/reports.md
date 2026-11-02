# Report Page

**Route**: `/reports`  
**Component**: `client/src/pages/main/ReportPage.tsx`  
**Icon**: ChartNoAxesColumn

## Overview

Analytics and reporting dashboard with charts, metrics, and export functionality for inventory analysis.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Reports                  [Date Range] [Filter] [Export] ⟳ │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┬─────────────────────────────────┐ │
│  │ Stock Status         │ Stock Movement Trend            │ │
│  │ ✓ OK: 145            │ [Line Chart - 30 Days]          │ │
│  │ ⚠ Low: 12           │ IN  ─── OUT --- ADJ ···         │ │
│  │ ✗ Out: 5            │                                  │ │
│  │ ○ Inactive: 10      │                                  │ │
│  │ [Pie Chart]          │                                  │ │
│  └──────────────────────┴─────────────────────────────────┘ │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Top 10 Products by Movement                           │ │
│  │ [Bar Chart - Qty Moved]                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌──────────────────────┬─────────────────────────────────┐ │
│  │ Warehouse Utilization│ Category Distribution           │ │
│  │ [Bar Chart]          │ [Horizontal Bar]                │ │
│  │ WH-A: 75%            │ Electronics: 45%                │ │
│  │ WH-B: 60%            │ Hardware: 35%                   │ │
│  │ WH-C: 82%            │ Software: 20%                   │ │
│  └──────────────────────┴─────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Report Types

### 1. Stock Status Report

**Chart Type**: Pie/Donut chart  
**Data**:
- In stock (quantity > minimum)
- Low stock (0 < quantity <= minimum)
- Out of stock (quantity = 0)
- Inactive products

**Metrics**:
- Product count per category
- Percentage distribution
- Total value (future)

**Interactions**:
- Click segment to drill down
- Legend toggle

### 2. Stock Movement Trend

**Chart Type**: Line chart  
**Period**: 7, 30, 90 days (configurable)  
**Data Points**:
- Daily IN quantity
- Daily OUT quantity
- Net change
- Running total

**Metrics**:
- Average daily movement
- Peak movement date
- Trend line

### 3. Top Moving Products

**Chart Type**: Horizontal bar chart  
**Sort**: By total quantity moved  
**Limit**: Top 10 products  
**Data**:
- Product name
- Total quantity moved
- IN/OUT breakdown

**Filter**: By time period, product category

### 4. Warehouse Utilization

**Chart Type**: Bar/Gauge chart  
**Data**:
- Warehouse name
- Current stock (units)
- Capacity (if configured)
- Utilization percentage
- Available capacity

**Metrics**:
- Average utilization
- Most/least utilized

### 5. Category Distribution

**Chart Type**: Horizontal bar chart  
**Data**:
- Category name
- Product count
- Total quantity
- Percentage of total

**Sort**: By quantity (descending)

### 6. Low Stock Alert Report

**Type**: Table  
**Data**:
- Product name/SKU
- Current stock
- Minimum stock
- Days until stockout (estimate)
- Supplier lead time
- Reorder quantity (suggested)

**Actions**:
- Create PO (future)
- Update minimum stock

### 7. Stock Value Report (Future)

**Data**:
- Product value (unit cost × quantity)
- Category value
- Warehouse value
- Slow-moving items

## Controls

### Date Range Selector

**Presets**:
- Today
- Last 7 days
- Last 30 days
- Last 90 days
- This month
- This year
- Custom range (date picker)

### Filters

1. **Warehouse Filter**
   - All warehouses
   - Specific warehouse

2. **Category Filter**
   - All categories
   - Specific category

3. **Product Filter**
   - All products
   - Active only
   - Low stock only
   - Out of stock only

### Actions

**Refresh**
- Auto-refresh every 5 minutes (toggle)
- Manual refresh button
- Last updated timestamp

**Export**
- Export as PDF (full report)
- Export as Excel (data tables)
- Email report (scheduled - future)

**Print**
- Print current view
- Print all charts

## Summary Metrics (Top Bar)

```
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Total Items │ │ Low Stock│ │Out of    │ │Total Qty │
│   in Stock  │ │ Products │ │Stock     │ │in Inventory
│    245      │ │    12    │ │    5     │ │  50,230  │
└─────────────┘ └──────────┘ └──────────┘ └──────────┘
```

**Period**: Configurable

## Data Management

### API Endpoints

```typescript
// Stock status summary
GET /api/reports/stock-status?warehouseId=1&categoryId=1

// Stock movement trend
GET /api/reports/stock-movement-trend?days=30&warehouseId=1

// Top moving products
GET /api/reports/top-products?limit=10&days=30

// Warehouse utilization
GET /api/reports/warehouse-utilization?warehouseId=1

// Category distribution
GET /api/reports/category-distribution?warehouseId=1

// Low stock alert
GET /api/reports/low-stock-alerts?warehouseId=1

// Export report
GET /api/reports/export?format=pdf|excel&reportType=full
```

### Types

```typescript
interface StockStatusReport {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  inactive: number;
}

interface MovementTrend {
  date: string;
  stockIn: number;
  stockOut: number;
  netChange: number;
}

interface TopProduct {
  productId: number;
  productName: string;
  totalMoved: number;
  stockIn: number;
  stockOut: number;
}

interface WarehouseUtilization {
  warehouseId: number;
  warehouseName: string;
  currentStock: number;
  capacity: number;
  utilizationPercent: number;
}
```

## Responsive Behavior

### Desktop (lg+)
- 2x2 grid layout
- Full charts
- All controls visible

### Tablet (md)
- 1x2 stacked layout
- Simplified charts
- Collapsed filters

### Mobile (sm)
- Single column
- Small charts with legends
- Horizontal scroll for tables
- Drawer filters

## States

- **Loading**: Chart skeleton, spinner
- **Error**: Error alert with retry
- **Empty**: "No data for selected period"
- **No Data**: Show message, suggest date range change

## Performance

- Chart library lazy loading
- Debounced filter changes
- Query caching (5 min stale)
- Pagination for tables

## Accessibility

- Chart descriptions
- Accessible color palettes (no red-green only)
- Table alt text
- ARIA labels on controls

## Future Enhancements

- Custom report builder
- Scheduled reports (email)
- Stock valuation reports
- Supplier performance
- Inventory aging analysis
- Forecast vs actual
- Mobile report view
- Real-time dashboard
- Trend prediction (ML)
