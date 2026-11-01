import type { ApiResponse, PaginationQuery } from "./api";

export interface CategoryItem {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategorySortBy = "name" | "createdAt";

export interface CategoryQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: CategorySortBy;
  sortOrder?: "asc" | "desc";
  categoryId?: number;
}

export type CategoryListResponse = ApiResponse<CategoryItem[]>;
export type CategoryResponse = ApiResponse<CategoryItem>;
