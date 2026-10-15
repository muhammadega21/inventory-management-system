import type { ApiResponse, PaginationQuery } from "./api";
import type { ProductInventory } from "./warehouse";

export interface ProductQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: string;
  sortOrder: "asc" | "desc";
  categoryId?: number;
}

export type ProductList = {
  id: number;
  category: {
    select: {
      id: number;
      name: string;
    };
  };
  name: string;
  sku: string;
  unit: string;
  minimum_stock: number;
  image: string;
  is_active: boolean;
  createdAt: string;
};

export type ProductDetail = ProductList & {
  description: string;
  updatedAt: string;
  stockMovements: {
    id: number;
    type: string;
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
      type: string;
      transaction_date: string;
      notes: string;
      user: {
        id: number;
        name: string;
      };
    };
  };
  inventories: ProductInventory[];
};

export type productSummary = {
  activeProducts: number;
  lowStock: number;
  stockout: number;
  inactiveProducts: number;
};

export type productListResponse = ApiResponse<ProductList[]>;
export type productDetailResponse = ApiResponse<ProductDetail>;
export type productSummaryResponse = ApiResponse<productSummary>;
