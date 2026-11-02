# Design Overview

Inventory Management System - Design Documentation

## Quick Links

- [Design System](./design-system.md) - Colors, typography, spacing, components
- [Components](./components.md) - Reusable UI components
- [Navigation](./navigation.md) - Navigation structure and routing
- [Dashboard](./pages/dashboard.md) - Main dashboard page
- [Master Pages](./pages/master/) - Master data management pages

## Architecture

### Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS + DaisyUI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod
- **State**: TanStack Query (React Query)
- **HTTP**: Axios

### Project Structure

```
client/src/
├── components/          # Reusable components
│   ├── forms/          # Form inputs
│   ├── modal/          # Modal dialogs
│   ├── loading/        # Loading states
│   └── dashboard/      # Dashboard widgets
├── pages/              # Page components
│   ├── main/           # Main pages
│   └── master/         # Master data pages
├── layouts/            # Layout components
├── hook/               # Custom hooks
├── services/           # API services
├── schemas/            # Zod schemas
├── type/               # TypeScript types
├── utils/              # Utility functions
└── routes/             # Router configuration
```

### Page Categories

**Main Pages**
- Dashboard - Overview & analytics
- Products - Product catalog management
- Inventory - Stock levels per warehouse
- Stock Movements - Stock in/out/adjustment history
- Reports - Analytics & reporting

**Master Data Pages**
- Categories - Product categories
- Suppliers - Supplier management
- Warehouses - Warehouse locations
- Users - User management
