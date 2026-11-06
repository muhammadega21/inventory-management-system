import type { ApiResponse, PaginationQuery } from "./api";

export interface SupplierItem {
  id: number;
  name: string;
  code: string;
  contact_person: string;
  phone: string | null;
  email: string;
  city: string;
  address: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SupplierPayload {
  name: string;
  contact_person: string;
  phone?: string;
  email: string;
  city: string;
  address: string;
  is_active: boolean;
}

export type SupplierSortBy = "name" | "createdAt";

export interface SupplierQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: SupplierSortBy;
  sortOrder?: "asc" | "desc";
  supplierId?: number;
}

export type SupplierListResponse = ApiResponse<SupplierItem[]>;
export type SupplierResponse = ApiResponse<SupplierItem>;
