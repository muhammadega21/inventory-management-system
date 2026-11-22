import type { ApiResponse, PaginationQuery } from "./api";

export interface WarehouseListItem {
  id: number;
  name: string;
  code: string;
  city: string;
  address: string;
  inventorySummary: {
    skuCount: number;
    totalQuantity: number;
  };
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WarehouseDetail extends WarehouseListItem {
  description: string | null;
  topProducts: {
    id: number;
    sku: string;
    name: string;
    unit: string;
    quantity: number;
  }[];
}

export interface WarehousePayload {
  name: string;
  city: string;
  address: string;
  description?: string;
  is_active: boolean;
}

export interface WarehouseSummary {
  totalWarehouses: number;
  activeWarehouses: number;
  inactiveWarehouses: number;
  skuLocationCount: number;
  totalQuantity: number;
}

export type WarehouseSortBy = "name" | "createdAt";

export interface WarehouseQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: WarehouseSortBy;
  sortOrder?: "asc" | "desc";
}

export type WarehouseListResponse = ApiResponse<WarehouseListItem[]>;
export type WarehouseResponse = ApiResponse<WarehouseDetail>;
export type WarehouseSummaryResponse = ApiResponse<WarehouseSummary>;
