import { api } from "../lib/axios";
import type { ApiResponse } from "../type/api";
import type {
  CategoryListResponse,
  CategoryQuery,
  CategoryPayload,
  CategoryResponse,
} from "../type/category";

export const getCategories = async (params: CategoryQuery) => {
  const { isActive, ...query } = params;
  const { data } = await api.get<CategoryListResponse>("/categories", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
    },
  });

  return data;
};

export const getCategoryById = async (id: number) => {
  const { data } = await api.get<CategoryResponse>(`/categories/${id}`);
  return data;
};

export const createCategory = async (payload: CategoryPayload) => {
  const { data } = await api.post<CategoryResponse>("/categories", payload);

  return data;
};
export const updateCategory = async (
  id: number,
  payload: Partial<CategoryPayload>,
) => {
  const { data } = await api.patch<CategoryResponse>(
    `/categories/${id}`,
    payload,
  );

  return data;
};
export const deleteCategory = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/categories/${id}`);
  return data;
};
