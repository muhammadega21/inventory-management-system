# Component Library

## Core Components

### Forms

#### Input
**Location**: `client/src/components/forms/Input.tsx`

Text input with label, error state, and validation support.

```tsx
<Input
  label="Product Name"
  placeholder="Enter product name"
  error={errors.name?.message}
  {...register("name")}
/>
```

**Props**:
- `label?: string` - Field label
- `placeholder?: string` - Input placeholder
- `error?: string` - Error message
- `required?: boolean` - Required indicator

#### Textarea
**Location**: `client/src/components/forms/Textarea.tsx`

Multiline text input.

```tsx
<Textarea
  label="Description"
  placeholder="Enter description"
  rows={4}
  error={errors.description?.message}
  {...register("description")}
/>
```

#### Select
**Location**: `client/src/components/forms/Select.tsx`

Dropdown select input.

```tsx
<Select
  label="Category"
  options={categories}
  error={errors.categoryId?.message}
  {...register("categoryId")}
/>
```

#### InputFile
**Location**: `client/src/components/forms/InputFile.tsx`

File upload input with preview.

```tsx
<InputFile
  label="Product Image"
  accept="image/*"
  error={errors.image?.message}
  {...register("image")}
/>
```

### Modal

#### Modal
**Location**: `client/src/components/modal/Modal.tsx`

Base modal component with backdrop and animations.

```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title">
  {/* Content */}
</Modal>
```

**Props**:
- `isOpen: boolean` - Control visibility
- `onClose: () => void` - Close handler
- `title: string` - Modal title
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Modal width

#### ModalCategory
**Location**: `client/src/components/modal/ModalCategory.tsx`

Category add/edit form modal.

```tsx
<ModalCategory
  isOpen={isOpen}
  onClose={onClose}
  mode="add" // or "edit"
  data={categoryData} // for edit mode
/>
```

#### ModalProduct
**Location**: `client/src/components/modal/ModalProduct.tsx`

Product add/edit form modal with image upload.

#### ModalSupplier
**Location**: `client/src/components/modal/ModalSupplier.tsx`

Supplier add/edit form modal.

### Navigation

#### Sidebar
**Location**: `client/src/components/Sidebar.tsx`

Main navigation sidebar with menu items.

**Menu Structure**:
- **Main Section**
  - Dashboard (`/`)
  - Products (`/products`)
  - Inventory (`/inventories`)
  - Stock Movements (`/stock-movements`)
  - Reports (`/reports`)
  
- **Master Data Section**
  - Categories (`/categories`)
  - Suppliers (`/suppliers`)
  - Warehouses (`/warehouses`)
  - Users (`/users`)

**Features**:
- Active state highlighting
- Lucide icons
- Grouped sections
- NavLink integration

#### Navbar
**Location**: `client/src/components/Navbar.tsx`

Top navigation bar with user menu.

**Features**:
- Notification icon
- User avatar with initials
- User dropdown menu (Profile, Settings, Logout)
- Role badge display

### Dashboard

#### PageHeader
**Location**: `client/src/components/dashboard/PageHeader.tsx`

Page title header with breadcrumbs.

```tsx
<PageHeader
  title="Products"
  breadcrumbs={["Master Data", "Products"]}
/>
```

**Props**:
- `title: string` - Page title
- `breadcrumbs?: string[]` - Breadcrumb path

### Loading

#### Spinner
**Location**: `client/src/components/loading/Spinner.tsx`

Loading spinner indicator.

```tsx
<Spinner size="sm" /> // sm, md, lg
```

**Variants**:
- `spinner` - Default circular spinner
- `dots` - Three dots animation
- `ring` - Ring spinner

### Utility

#### Pagination
**Location**: `client/src/components/Pagination.tsx`

Table pagination controls.

```tsx
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>
```

**Features**:
- Previous/Next buttons
- Page number display
- Disabled states
- Jump to page

#### ProtectedRoute
**Location**: `client/src/components/ProtectedRoute.tsx`

Route guard for authentication.

```tsx
<ProtectedRoute>
  <DashboardLayout />
</ProtectedRoute>
```

**Behavior**:
- Check authentication token
- Redirect to `/login` if not authenticated
- Show loading state during check

## Component Patterns

### Form Validation

All forms use React Hook Form + Zod:

```tsx
const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues,
});
```

### Data Fetching

TanStack Query for server state:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ["categories", params],
  queryFn: () => categoryService.getAll(params),
});
```

### Mutations

```tsx
const mutation = useMutation({
  mutationFn: categoryService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
    showAlert.success("Category created");
  },
});
```

### Modal State

```tsx
const [isOpen, setIsOpen] = useState(false);
const [mode, setMode] = useState<"add" | "edit">("add");
const [selectedData, setSelectedData] = useState<Data | undefined>();

const handleAdd = () => {
  setMode("add");
  setSelectedData(undefined);
  setIsOpen(true);
};

const handleEdit = (data: Data) => {
  setMode("edit");
  setSelectedData(data);
  setIsOpen(true);
};
```

## Styling Conventions

### Tailwind Classes

- Use DaisyUI component classes (`btn`, `card`, `input`)
- Add custom spacing with Tailwind utilities
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- State variants: `hover:`, `focus:`, `disabled:`

### Class Order

1. Layout (`flex`, `grid`, `block`)
2. Positioning (`relative`, `absolute`)
3. Sizing (`w-full`, `h-16`)
4. Spacing (`p-4`, `m-2`)
5. Typography (`text-sm`, `font-bold`)
6. Colors (`bg-primary`, `text-white`)
7. Effects (`shadow-sm`, `rounded`)
8. States (`hover:`, `focus:`)

### Responsive Design

```tsx
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile full width, tablet half, desktop third */}
</div>
```

## Icon Usage

```tsx
import { Package, Edit, Trash } from "lucide-react";

<Package size={18} className="opacity-80" />
<Edit size={16} className="text-primary" />
<Trash size={16} className="text-error" />
```

**Standard sizes**:
- `16px` - Small icons (inline, buttons)
- `18px` - Default icons (menu, cards)
- `24px` - Large icons (headers, features)
