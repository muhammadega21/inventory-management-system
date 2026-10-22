import type { ApiResponse, PaginationQuery } from "./api";
import type { ProductInventory } from "./warehouse";

export type StockType = "IN" | "OUT" | "ADJUSTMENT";

export interface ProductCategory {
  id: number;
  name: string;
}
export interface ProductListItem {
  id: number;
  category: ProductCategory;
  name: string;
  sku: string;
  unit: string;
  minimum_stock: number;
  image: string | null;
  is_active: boolean;
  createdAt: string;
}

export interface ProductStockMovement {
  id: number;
  type: StockType;
  quantity: number;
  quantity_before: number;
  quantity_after: number;
  createdAt: string;
  warehouse: {
    id: number;
    name: string;
    code: string;
    city: string;
    is_active: boolean;
  };
  stockTransaction: {
    id: number;
    transaction_number: string;
    type: StockType;
    transaction_date: string;
    notes: string | null;
    user: {
      id: number;
      name: string;
    };
  };
}

export interface ProductDetail extends ProductListItem {
  description: string | null;
  updatedAt: string;
  stockMovements?: ProductStockMovement[];
  inventories?: ProductInventory[];
}

export interface ProductSummary {
  activeProducts: number;
  lowStock: number;
  stockout: number;
  inactiveProducts: number;
}

export type ProductSortBy = "name" | "createdAt";

export interface ProductQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: ProductSortBy;
  sortOrder: "asc" | "desc";
  categoryId?: number;
}

export type ProductListResponse = ApiResponse<ProductListItem[]>;
export type ProductResponse = ApiResponse<ProductListItem>;
export type ProductDetailResponse = ApiResponse<ProductDetail>;
export type ProductSummaryResponse = ApiResponse<ProductSummary>;
