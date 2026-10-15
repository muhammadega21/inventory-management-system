import { api } from "../lib/axios";
import type {
  productDetailResponse,
  productListResponse,
  ProductQuery,
  productSummaryResponse,
} from "../type/product";

export const getProducts = async (params: ProductQuery) => {
  const { data } = await api.get<productListResponse>("/products", {
    params,
  });

  return data;
};

export const getProductSummary = async () => {
  const { data } = await api.get<productSummaryResponse>("/products/summary");

  return data;
};

export const getProductById = async (id: number) => {
  const { data } = await api.get<productDetailResponse>(`/products/${id}`);

  return data;
};

export const createProduct = async (payload: FormData) => {
  const { data } = await api.post<productListResponse>("/products", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const updateProduct = async (id: number, payload: FormData) => {
  const { data } = await api.patch<productListResponse>(
    `/products/${id}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete<productListResponse>(`/products/${id}`);

  return data;
};
