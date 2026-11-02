# Users Page

**Route**: `/users`  
**Component**: `client/src/pages/master/UserPage.tsx`  
**Icon**: UsersRound

## Overview

User account and access management with role assignment, status controls, and audit visibility.

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Users                               [Search] [+ Add User]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Role: [All ▼]  Status: [All ▼]                              │
│                                                               │
│  ┌──────────┬──────────┬────────┬──────────┬───────┬───────┐ │
│  │ Name     │ Email    │ Role   │ Last     │Active │Action │ │
│  │          │          │        │ Login    │       │       │ │
│  ├──────────┼──────────┼────────┼──────────┼───────┼───────┤ │
│  │ Jane Doe │jane@...  │ Admin  │ 2h ago   │  ✓    │Edit...│ │
│  │ John Roe │john@...  │ Staff  │ 1d ago   │  ✓    │Edit...│ │
│  └──────────┴──────────┴────────┴──────────┴───────┴───────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Features

### Table Columns

| Column | Width | Content |
|--------|-------|---------|
| Name | 20% | Avatar and full name |
| Email | 25% | Login email |
| Role | 15% | Role badge |
| Last Login | 15% | Relative datetime |
| Active | 10% | Active/Inactive badge |
| Actions | 15% | Edit, Reset Password, Deactivate |

### Role Model

| Role | Access |
|------|--------|
| Admin | All pages, users, system settings |
| Manager | Products, inventory, movements, reports, master data |
| Staff | Products, inventory, stock movements |
| Viewer | Read-only dashboard, inventory, reports |

### Modal Fields

**Create/Edit User**:
- Name (required)
- Email (required, unique)
- Role (required select)
- Password (create only, strength validation)
- Confirm Password (create only)
- Active toggle

### Actions

- Add user
- Edit user
- Reset password (confirmation)
- Activate/deactivate user
- Delete user (admin only; prefer deactivation)

## Data Management

```typescript
GET /api/users?page=1&limit=10&role=&isActive=&search=
GET /api/users/:id
POST /api/users
PUT /api/users/:id
PATCH /api/users/:id/status
POST /api/users/:id/reset-password
DELETE /api/users/:id
```

## Security

- Never display password values
- Password reset uses secure token flow
- Enforce server-side role authorization
- Audit user and role changes
- Prevent deleting current logged-in admin

## Responsive Behavior

- Desktop: Full table
- Tablet: Hide last login or email truncation
- Mobile: User cards with action menu
