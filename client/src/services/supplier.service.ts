import { api } from "../lib/axios";
import type { ApiResponse } from "../type/api";
import type {
  SupplierListResponse,
  SupplierPayload,
  SupplierQuery,
  SupplierResponse,
} from "../type/supplier";

export const getSuppliers = async (params: SupplierQuery) => {
  const { isActive, ...query } = params;
  const { data } = await api.get<SupplierListResponse>("/suppliers", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
    },
  });

  return data;
};

export const getSupplierById = async (id: number) => {
  const { data } = await api.get<SupplierResponse>(`/suppliers/${id}`);
  return data;
};

export const createSupplier = async (payload: SupplierPayload) => {
  const { data } = await api.post<SupplierResponse>("/suppliers", payload);

  return data;
};

export const updateSupplier = async (
  id: number,
  payload: Partial<SupplierPayload>,
) => {
  const { data } = await api.patch<SupplierResponse>(
    `/suppliers/${id}`,
    payload,
  );

  return data;
};

export const deleteSupplier = async (id: number) => {
  const { data } = await api.delete<ApiResponse<null>>(`/suppliers/${id}`);

  return data;
};
