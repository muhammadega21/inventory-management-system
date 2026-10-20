import { api } from "../lib/axios";
import type { PaginationMeta } from "../type/api";
import type { CategoryListItem, CategoryListResponse } from "../type/category";

export interface CategoryOptionsResult {
  items: CategoryListItem[];
  meta?: PaginationMeta;
}

export async function getCategories(isActive?: boolean) {
  const response = await api.get<CategoryListResponse>("/categories", {
    params: {
      page: 1,
      limit: 100,
      ...(isActive === undefined ? {} : { is_active: isActive }),
      sortBy: "name",
      sortOrder: "asc",
    },
  });

  return { items: response.data.data, meta: response.data.meta };
}

export async function getActiveCategories() {
  return getCategories(true);
}
