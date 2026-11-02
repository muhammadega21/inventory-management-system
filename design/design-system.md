# Design System

## Colors

### Primary Palette

| Color | HEX | Use |
|-------|-----|-----|
| Primary | `#4F46E5` | Main brand color, buttons, active states |
| Primary Content | `#FFFFFF` | Text on primary background |
| Secondary | `#7E69AB` | Secondary actions, accents |
| Accent | `#F59E0B` | Highlights, warnings, notifications |
| Neutral | `#6B7280` | Text, borders, disabled states |

### Status Colors

| Status | HEX | Use |
|--------|-----|-----|
| Success | `#10B981` | Success states, completed actions |
| Error | `#EF4444` | Error messages, destructive actions |
| Warning | `#F59E0B` | Warnings, caution states |
| Info | `#3B82F6` | Information messages, help |

### Backgrounds

| Surface | HEX | Use |
|---------|-----|-----|
| Base-100 | `#FFFFFF` | Main background |
| Base-200 | `#F9FAFB` | Card backgrounds, hover states |
| Base-300 | `#E5E7EB` | Borders, separators |

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono

### Text Scale

| Scale | Size (px) | Line Height | Weight | Use |
|-------|-----------|-------------|--------|-----|
| H1 | 36px | 44px | 700 | Page titles |
| H2 | 30px | 36px | 700 | Section headers |
| H3 | 24px | 32px | 600 | Subsection headers |
| H4 | 20px | 28px | 600 | Card titles |
| H5 | 18px | 24px | 600 | Modal titles |
| Body Large | 18px | 28px | 400 | Large body text |
| Body | 16px | 24px | 400 | Default body text |
| Body Small | 14px | 20px | 400 | Small text, captions |
| Body XS | 12px | 16px | 400 | Metadata, labels |

### Spacing

| Scale | Size (px) | Use |
|-------|-----------|-----|
| xs | 4px | Tight spacing, element padding |
| sm | 8px | Small gaps, form spacing |
| base | 16px | Default spacing |
| md | 24px | Section spacing |
| lg | 32px | Large spacing |
| xl | 48px | Extra large spacing |
| 2xl | 64px | Hero spacing |

## Components

### Buttons

**Primary Button**
```html
<button class="btn btn-primary">Primary Action</button>
```

**Secondary Button**
```html
<button class="btn btn-secondary">Secondary Action</button>
```

**Outline Button**
```html
<button class="btn btn-outline">Outline Action</button>
```

**Ghost Button**
```html
<button class="btn btn-ghost">Ghost Action</button>
```

**Sizes**
- `btn-sm` - Small button (height: 32px)
- `btn-md` - Medium button (height: 40px) - Default
- `btn-lg` - Large button (height: 48px)

### Cards

**Standard Card**
```html
<div class="card bg-base-100 shadow-sm border border-base-300">
  <div class="card-body">
    <!-- Content -->
  </div>
</div>
```

**Card with Header**
```html
<div class="card bg-base-100 shadow-sm border border-base-300">
  <div class="card-header bg-base-200 border-b border-base-300 px-4 py-3">
    <h4 class="font-semibold">Card Title</h4>
  </div>
  <div class="card-body">
    <!-- Content -->
  </div>
</div>
```

### Forms

**Input Field**
```html
<div class="form-control">
  <label class="label">
    <span class="label-text">Field Label</span>
  </label>
  <input type="text" class="input input-bordered" placeholder="Placeholder" />
</div>
```

**Textarea**
```html
<div class="form-control">
  <label class="label">
    <span class="label-text">Description</span>
  </label>
  <textarea class="textarea textarea-bordered" placeholder="Enter description"></textarea>
</div>
```

**Select**
```html
<div class="form-control">
  <label class="label">
    <span class="label-text">Select Option</span>
  </label>
  <select class="select select-bordered">
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
</div>
```

### Tables

**Standard Table**
```html
<div class="overflow-x-auto">
  <table class="table table-zebra">
    <thead>
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody>
      <!-- Rows -->
    </tbody>
  </table>
</div>
```

**Compact Table**
```html
<table class="table table-zebra table-sm">
  <!-- Content -->
</table>
```

## Layout

### Grid System

- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Grid Gap**: Use Tailwind gap classes (`gap-4`, `gap-6`, `gap-8`)

### Responsive Breakpoints

| Breakpoint | Min Width | Use |
|------------|-----------|-----|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet portrait |
| lg | 1024px | Tablet landscape / Desktop |
| xl | 1280px | Desktop large |
| 2xl | 1536px | Desktop extra large |

## Icons

- **Icon Library**: Lucide React
- **Size**: Standard size 18px (size 4 in Tailwind)
- **Color**: Inherit text color or use utility classes

```jsx
import { Package, Truck, Users } from "lucide-react";
```

## Accessibility

### Keyboard Navigation
- Focus states visible with `focus:ring-2 focus:ring-primary`
- Tab order follows visual layout
- Skip navigation available

### ARIA Labels
- Form controls have associated labels
- Interactive elements have ARIA attributes
- Status messages use ARIA live regions

### Contrast Ratios
- Text to background minimum 4.5:1
- Large text minimum 3:1
- UI components minimum 3:1

## Dark Mode Support

The design system includes dark mode variants using Tailwind's dark mode utility:

```html
<div class="bg-base-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <!-- Content -->
</div>
```

### Dark Mode Colors

| Surface | Light | Dark |
|---------|-------|------|
| Base-100 | `#FFFFFF` | `#1F2937` |
| Base-200 | `#F9FAFB` | `#374151` |
| Base-300 | `#E5E7EB` | `#4B5563` |
| Text | `#111827` | `#F9FAFB` |
| Muted | `#6B7280` | `#9CA3AF` |
