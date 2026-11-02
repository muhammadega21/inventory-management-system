# Product Page

**Route**: `/products`  
**Component**: `client/src/pages/main/ProductPage.tsx`  
**Icon**: Package

## Overview

Product catalog management page with listing, search, filtering, and CRUD operations.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Products                          [Search] [Filter] [+ Add] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Category: [All ▼]  Active: [All ▼]  Sort: [Name ▼]        │
│                                                               │
│  ┌──────┬──────────┬────────┬────┬──────┬───────┬──────────┐ │
│  │ SKU  │ Name     │ Cat.   │Qty │Unit  │Active │ Actions  │ │
│  ├──────┼──────────┼────────┼────┼──────┼───────┼──────────┤ │
│  │ P001 │ Product1 │ Elec.  │150 │ pcs  │  ✓    │ Edit Del  │ │
│  │ P002 │ Product2 │ Hard.  │ 25 │ box  │  ✓    │ Edit Del  │ │
│  │ P003 │ Product3 │ Soft.  │  0 │ pcs  │  ✗    │ Edit Del  │ │
│  └──────┴──────────┴────────┴────┴──────┴───────┴──────────┘ │
│                                                               │
│  Showing 1-10 of 50                          [◄ 1 2 3 ►]    │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Header Section

**Title**: "Products"  
**Actions**:
- Search input (SKU, name, description)
- Filter dropdown
- Add Product button (ModalProduct)

### Filters

1. **Category Filter**
   - All categories
   - Dropdown with category list
   - Multi-select (future)

2. **Status Filter**
   - All
   - Active only
   - Inactive only

3. **Stock Status Filter**
   - All
   - In stock
   - Low stock
   - Out of stock

4. **Sort Options**
   - Name (A-Z)
   - SKU
   - Created date
   - Modified date

### Table Columns

| Column | Width | Type | Content |
|--------|-------|------|---------|
| SKU | 12% | Text | Product SKU |
| Name | 20% | Text | Product name with image thumbnail |
| Category | 15% | Text | Category name |
| Stock | 10% | Number | Current total quantity |
| Unit | 10% | Text | Unit of measurement |
| Minimum | 10% | Number | Minimum stock level |
| Active | 8% | Badge | Green/Gray badge |
| Actions | 15% | Buttons | Edit, Delete, View details |

### Table Features

- **Sorting**: Click column header to sort
- **Row Hover**: Highlight row, show action buttons
- **Image Preview**: Hover on image thumbnail
- **Status Badge**: Color-coded active/inactive
- **Stock Alert**: Red highlight if low/out of stock

### Search

**Fields Searched**:
- SKU
- Product name
- Category name
- Description

**Behavior**:
- Debounced 300ms
- Case-insensitive
- Partial match

### Pagination

**Options**: 10, 25, 50 items per page  
**Display**: "Showing X-Y of Z"

### Actions

**Edit Product**
- Opens ModalProduct in edit mode
- Pre-fills form with product data
- Shows current image

**Delete Product**
- Confirmation dialog
- Hard delete or soft delete (archive)
- Redirect to list after delete

**View Details** (Future)
- Product detail page
- Stock movements history
- Warehouse inventory

## Modals

### ModalProduct

**Mode**: Add / Edit

**Form Fields**:
- Category (Select)
- SKU (Text, unique validation)
- Name (Text, required)
- Description (Textarea)
- Unit (Select)
- Minimum Stock (Number)
- Image (File upload)
- Active (Checkbox)

**Validation**:
- SKU: 3-50 characters, unique
- Name: 3-100 characters
- Description: max 500 characters
- Minimum Stock: >= 0
- Image: JPG/PNG, max 2MB

**Actions**:
- Save (Create/Update)
- Cancel
- Reset form

## Data Management

### States

**Loading**: Skeleton table rows  
**Error**: Error alert with retry  
**Empty**: "No products found" message  
**Success**: Toast notification after add/edit/delete

### API Endpoints

```typescript
// List products with filters
GET /api/products?page=1&limit=10&categoryId=1&isActive=true&sortBy=name&sortOrder=asc

// Get product details
GET /api/products/:id

// Create product
POST /api/products
Body: {
  categoryId: number;
  sku: string;
  name: string;
  description?: string;
  unit: string;
  minimumStock: number;
  image?: File;
  isActive: boolean;
}

// Update product
PUT /api/products/:id
Body: Same as create

// Delete product
DELETE /api/products/:id

// Get product summary
GET /api/products/summary
```

### Hooks

- `useProduct()` - List products
- `useCreateProduct()` - Create product
- `useUpdateProduct()` - Update product
- `useDeleteProduct()` - Delete product
- `useGetProductById()` - Get product details

## Responsive Behavior

### Desktop (lg+)
- Full table with all columns
- Inline actions
- Modal dialogs

### Tablet (md)
- Hide Unit, Minimum columns
- Collapse actions to menu
- Drawer modals

### Mobile (sm)
- Card view instead of table
- Stack columns
- Full-screen modals

## Performance

- Virtual scrolling for large lists
- Image lazy loading
- Query debouncing
- Pagination (not infinite scroll)

## Future Enhancements

- Bulk actions (delete, activate/deactivate)
- Export to CSV/Excel
- Import products from file
- Product variants/SKUs
- Barcode scanning
- Stock movement history per product
- Product comparison
