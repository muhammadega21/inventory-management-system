# Categories Page

**Route**: `/categories`  
**Component**: `client/src/pages/master/CategoryPage.tsx`  
**Icon**: Tag

## Overview

Product category management with hierarchical structure (future), listing, search, and CRUD operations.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Categories                      [Search] [+ Add Category]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┬──────────────────────┬────────┬──────────────┐ │
│  │ Name     │ Description          │Active  │ Actions      │ │
│  ├──────────┼──────────────────────┼────────┼──────────────┤ │
│  │ Elec.    │ Electronic items...   │ ✓      │ Edit Del     │ │
│  │ Hardware │ Hardware products    │ ✓      │ Edit Del     │ │
│  │ Software │ Software licenses   │ ✗      │ Edit Del     │ │
│  └──────────┴──────────────────────┴────────┴──────────────┘ │
│                                                               │
│  Showing 1-10 of 15                            [◄ 1 2 ►]   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Table Columns

| Column | Width | Type | Content |
|--------|-------|------|---------|
| ID | 6% | Number | Category ID |
| Name | 20% | Text | Category name |
| Description | 40% | Text | Description (truncated) |
| Active | 10% | Badge | Active/Inactive |
| Product Count | 12% | Number | Products in this category |
| Actions | 12% | Buttons | Edit, Delete |

### Search

**Field**: Name  
**Behavior**: Debounced 300ms, partial match

### Sort

- By name (default A-Z)
- By created date
- By product count

### Actions

**Add Category**
- Opens ModalCategory in add mode
- Form fields: Name, Description, Active (toggle)

**Edit Category**
- Opens ModalCategory in edit mode
- Pre-filled form
- Shows product count (warning if >0)

**Delete Category**
- Confirmation dialog
- Warning if products assigned
- Option to reassign products

**Bulk Actions** (Future)
- Activate/Deactivate selected
- Assign parent category
- Delete selected (if no products)

## ModalCategory

**Fields**:
- `name` (text, required, 3-50 chars)
- `description` (textarea, optional, max 500 chars)
- `is_active` (checkbox, default true)

**Validation**:
```typescript
const categoryFormSchema = z.object({
  name: z.string().trim().min(3).max(50),
  description: z.string().trim().max(500).optional(),
  is_active: z.boolean().default(true),
});
```

**Actions**:
- Create (POST)
- Update (PUT)
- Cancel
- Reset

### Empty State

"No categories yet. Create your first category."

### Filters (Future)

- Active only
- Inactive only
- Has products / No products

## Data Management

### API Endpoints

```typescript
// List categories with pagination
GET /api/categories?page=1&limit=10&sortBy=name&sortOrder=asc

// Get category details
GET /api/categories/:id

// Create category
POST /api/categories
Body: { name, description, is_active }

// Update category
PUT /api/categories/:id
Body: Same as create

// Delete category
DELETE /api/categories/:id

// Get category product count
GET /api/categories/:id/products
```

### Types

```typescript
interface CategoryItem {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { products: number };
}

interface CategoryPayload {
  name: string;
  description?: string;
  is_active: boolean;
}
```

### Hooks

- `useCategory()` - List categories
- `useCreateCategory()` - Create category
- `useUpdateCategory()` - Update category
- `useDeleteCategory()` - Delete category
- `useGetCategoryById()` - Get by ID

## Responsive Behavior

### Desktop (lg+)
- Full table
- Inline actions
- Modal dialog

### Tablet (md)
- Drop Product Count column
- Compact rows
- Action menu

### Mobile (sm)
- Card view
- Full-screen modal

## States

- **Loading**: Skeleton rows
- **Error**: Error alert with retry
- **Empty**: Empty state message with CTA
- **Success**: Toast notification

## Performance

- Virtual scrolling for large lists
- Query caching (stale: 5 min)

## Future Enhancements

- **Parent-Child Categories**: Hierarchical tree view
- **Category Images**: Thumbnail icons
- **Category Insights**: Product count, stock value
- **Bulk Import**: CSV import
- **Reorder Categories**: Drag-and-drop ordering
- **Category-based Filters**: Link from category to product filter
- **Category Templates**: Presets for common categories
- **Audit Trail**: Who modified when
- **Soft Delete with Restore**: Recover deleted categories
   - **Merge Categories**: Combine duplicates and reassign products
