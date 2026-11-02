# Navigation Structure

## Application Routes

### Public Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | LoginPage | User authentication |

### Protected Routes

All routes below require authentication via `ProtectedRoute` component.

#### Main Routes

| Route | Component | Icon | Description |
|-------|-----------|------|-------------|
| `/` | DashboardPage | LayoutDashboard | Overview dashboard with analytics |
| `/products` | ProductPage | Package | Product catalog management |
| `/inventories` | InventoryPage | Layers | Stock levels per warehouse |
| `/stock-movements` | StockMovementPage | ArrowLeftRight | Stock transaction history |
| `/reports` | ReportPage | ChartNoAxesColumn | Analytics and reporting |

#### Master Data Routes

| Route | Component | Icon | Description |
|-------|-----------|------|-------------|
| `/categories` | CategoryPage | Tag | Product category management |
| `/suppliers` | SupplierPage | Truck | Supplier management |
| `/warehouses` | WarehousePage | Warehouse | Warehouse location management |
| `/users` | UserPage | UsersRound | User management |

## Router Configuration

**Location**: `client/src/routes/index.tsx`

```tsx
const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      // Main routes
      { index: true, Component: DashboardPage },
      { path: "products", Component: ProductPage },
      { path: "inventories", Component: InventoryPage },
      { path: "stock-movements", Component: StockMovementPage },
      { path: "reports", Component: ReportPage },
      
      // Master data routes
      { path: "categories", Component: CategoryPage },
      { path: "suppliers", Component: SupplierPage },
      { path: "warehouses", Component: WarehousePage },
      { path: "users", Component: UserPage },
    ],
  },
]);
```

## Layout Structure

### DashboardLayout

Wraps all authenticated pages with sidebar and navbar.

```
┌─────────────────────────────────────────────┐
│              Navbar                         │
├──────────┬──────────────────────────────────┤
│          │                                  │
│          │                                  │
│ Sidebar  │         Page Content             │
│          │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**Components**:
- **Navbar**: Top bar with notifications, user menu
- **Sidebar**: Left navigation menu
- **Outlet**: Page content area (React Router outlet)

## Sidebar Menu

**Location**: `client/src/components/Sidebar.tsx`

### Menu Groups

#### Main Section
- **Label**: "MAIN"
- **Items**:
  - Dashboard
  - Products
  - Inventory
  - Stock Movements
  - Reports

#### Master Data Section
- **Label**: "MASTER DATA"
- **Items**:
  - Categories
  - Suppliers
  - Warehouses
  - Users

### Active State

NavLink automatically applies active class:

```tsx
<NavLink
  to="/products"
  className={({ isActive }) =>
    `${isActive ? "bg-primary text-primary-content" : "hover:bg-primary hover:text-primary-content"}`
  }
>
  <Package size={18} />
  <span className="text-sm">Products</span>
</NavLink>
```

**Active Styles**:
- Background: `bg-primary`
- Text: `text-primary-content`

**Hover Styles**:
- Background: `hover:bg-primary`
- Text: `hover:text-primary-content`

## Navbar Menu

**Location**: `client/src/components/Navbar.tsx`

### Elements

1. **Notification Icon**
   - Bell icon (Lucide)
   - Badge for unread count

2. **Divider**
   - Vertical separator

3. **User Menu**
   - Avatar with initials
   - User name
   - Role badge
   - Dropdown chevron

### User Dropdown

**Menu Items**:
- Profile (User icon)
- Settings (Cog icon)
- Logout (LogOut icon)

**Popover Behavior**:
- Anchor positioning
- Dropdown end alignment
- Auto dismiss on click outside

## Breadcrumbs

**Utility**: `client/src/utils/breadcrumbs.ts`

Generates breadcrumb path from current route.

```tsx
const breadcrumbs = getBreadcrumbs("/categories");
// Returns: ["Master Data", "Categories"]
```

**Usage in PageHeader**:
```tsx
<PageHeader
  title="Categories"
  breadcrumbs={["Master Data", "Categories"]}
/>
```

## Navigation Flow

### Authentication Flow

```
User visits app
  → Check token
    → Valid: Load DashboardLayout
    → Invalid: Redirect to /login
  
Login success
  → Store token
  → Redirect to /
  
Logout
  → Clear token
  → Redirect to /login
```

### Page Navigation

```
Click sidebar link
  → NavLink navigates
  → Route matches component
  → Page loads in Outlet
  → Active state updates
  → Breadcrumbs update
```

## Mobile Responsive

### Sidebar Behavior

- **Desktop** (lg+): Always visible, fixed left
- **Tablet**: Collapsible drawer
- **Mobile**: Hidden, toggle with hamburger menu

### Navbar Behavior

- **Desktop**: Full user info displayed
- **Mobile**: Compact view, icons only

## Keyboard Navigation

### Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Navigate through menu items |
| `Enter` | Activate focused link |
| `Esc` | Close user dropdown |
| `/` | Focus search (if implemented) |

### Focus Management

- Clear focus outline with `focus:ring-2 focus:ring-primary`
- Skip to content link available
- Logical tab order maintained

## Deep Linking

All routes support direct URL access:
- `https://app.example.com/products` - Direct to products page
- `https://app.example.com/categories` - Direct to categories page

Query parameters preserved across navigation:
- `?page=2&limit=20&sortBy=name`

## Route Guards

### ProtectedRoute

**Location**: `client/src/components/ProtectedRoute.tsx`

Checks authentication before rendering children:

```tsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};
```

### Role-Based Access (Future)

Planned implementation for role-based route protection:

```tsx
<ProtectedRoute roles={["admin", "manager"]}>
  <UserPage />
</ProtectedRoute>
```

## 404 Handling

Future implementation for not found routes:

```tsx
{
  path: "*",
  Component: NotFoundPage,
}
```
