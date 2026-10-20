import type { ApiResponse } from "./api";

export interface CategoryListItem {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CategoryListResponse = ApiResponse<CategoryListItem[]>;
