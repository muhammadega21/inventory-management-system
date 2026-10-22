import { api } from "../lib/axios";
import type { CategoryListResponse } from "../type/category";

export async function getCategories(isActive?: boolean) {
  const { data } = await api.get<CategoryListResponse>("/categories", {
    params: {
      page: 1,
      limit: 100,
      ...(isActive === undefined ? {} : { is_active: isActive }),
      sortBy: "name",
      sortOrder: "asc",
    },
  });

  return data;
}

export async function getActiveCategories() {
  return getCategories(true);
}
