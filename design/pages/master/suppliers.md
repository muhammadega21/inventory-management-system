# Suppliers Page

**Route**: `/suppliers`  
**Component**: `client/src/pages/master/SupplierPage.tsx`  
**Icon**: Truck

## Overview

Supplier database management with contact details, status tracking, address management, and CRUD operations.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Suppliers                         [Search] [+ Add Supplier] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────┬──────────┬──────────┬──────────┬────────┬────────┐ │
│  │ Code │ Name     │ Contact  │ Phone    │ Active │Actions │ │
│  ├──────┼──────────┼──────────┼──────────┼────────┼────────┤ │
│  │ S001 │ SupplierA│ John Doe │ 0812...  │   ✓    │Edit Del│ │
│  │ S002 │ SupplierB│ Jane Roe │ 0813...  │   ✓    │Edit Del│ │
│  │ S003 │ SupplierC│ Alex Co  │ 0814...  │   ✗    │Edit Del│ │
│  └──────┴──────────┴──────────┴──────────┴────────┴────────┘ │
│                                                               │
│  Showing 1-10 of 25                           [◄ 1 2 3 ►]  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Table Columns

| Column | Width | Type | Content |
|--------|-------|------|---------|
| Code | 10% | Text | Supplier Code (unique, e.g. SUP-001) |
| Name | 22% | Text | Company / Supplier Name |
| Contact Person | 18% | Text | Primary contact person name |
| Phone | 15% | Text | Contact phone number |
| Email | 15% | Text | Email address |
| Active | 8% | Badge | Active (Green) / Inactive (Gray) |
| Actions | 12% | Buttons | Edit, Delete |

### Search

**Fields**:
- Supplier Name
- Supplier Code
- Contact Person
- Phone Number
- Email

**Behavior**: Debounced 300ms, partial match

### Actions

**Add Supplier**
- Opens ModalSupplier in add mode
- Fields: Code, Name, Contact Person, Phone, Email, Address, Active toggle

**Edit Supplier**
- Opens ModalSupplier in edit mode
- Pre-filled form with supplier data

**Delete Supplier**
- Confirmation dialog via SweetAlert2 (`swal.ts`)
- Block deletion if associated with existing Purchase Orders or transactions

## ModalSupplier

**Fields**:
- `code` (text, required, auto-generated or manual, unique)
- `name` (text, required, 3-100 chars)
- `contact_person` (text, optional)
- `phone` (text, optional, phone format)
- `email` (text, optional, email format)
- `address` (textarea, optional)
- `is_active` (boolean toggle, default true)

## Data Management

### API Endpoints

```typescript
GET /api/suppliers?page=1&limit=10&search=&sortBy=name&sortOrder=asc
GET /api/suppliers/:id
POST /api/suppliers
PUT /api/suppliers/:id
DELETE /api/suppliers/:id
```

### Hooks

- `useSupplier()` - List suppliers
- `useCreateSupplier()` - Create supplier
- `useUpdateSupplier()` - Update supplier
- `useDeleteSupplier()` - Delete supplier
- `useGetSupplierById()` - Get by ID
