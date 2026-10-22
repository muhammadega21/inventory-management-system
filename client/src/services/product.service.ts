import { api } from "../lib/axios";
import type { ApiResponse } from "../type/api";
import type {
  ProductDetailResponse,
  ProductListResponse,
  ProductQuery,
  ProductResponse,
  ProductSummaryResponse,
} from "../type/product";

export const getProducts = async (params: ProductQuery) => {
  const { isActive, ...query } = params;
  const { data } = await api.get<ProductListResponse>("/products", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
    },
  });

  return data;
};

export const getProductSummary = async () => {
  const { data } = await api.get<ProductSummaryResponse>("/products/summary");
  return data;
};

export const getProductById = async (id: number) => {
  const { data } = await api.get<ProductDetailResponse>(`/products/${id}`);
  return data;
};

export const createProduct = async (payload: FormData) => {
  const { data } = await api.post<ProductResponse>("/products", payload, {
    headers: { "Content-Type": false },
  });
  return data;
};

export const updateProduct = async (id: number, payload: FormData) => {
  const { data } = await api.patch<ProductResponse>(
    `/products/${id}`,
    payload,
    {
      headers: { "Content-Type": false },
    },
  );
  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/products/${id}`);
  return data;
};
