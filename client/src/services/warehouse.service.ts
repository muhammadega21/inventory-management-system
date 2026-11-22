import { api } from "../lib/axios";
import type {
  WarehouseListResponse,
  WarehousePayload,
  WarehouseQuery,
  WarehouseResponse,
  WarehouseSummaryResponse,
} from "../type/warehouse";

export const getWarehouses = async (params: WarehouseQuery) => {
  const { isActive, ...query } = params;
  const { data } = await api.get<WarehouseListResponse>("/warehouses", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
    },
  });

  return data;
};

export const getWarehouseSummary = async () => {
  const { data } = await api.get<WarehouseSummaryResponse>(
    "/warehouses/summary",
  );

  return data;
};

export const getWarehouseById = async (id: number) => {
  const { data } = await api.get<WarehouseResponse>(`/warehouses/${id}`);
  return data;
};

export const createWarehouse = async (payload: WarehousePayload) => {
  const { data } = await api.post<WarehouseResponse>("/warehouses", payload);
  return data;
};

export const updateWarehouse = async (
  id: number,
  payload: Partial<WarehousePayload>,
) => {
  const { data } = await api.patch<WarehouseResponse>(
    `/warehouses/${id}`,
    payload,
  );
  return data;
};

export const deleteWarehouse = async (id: number) => {
  const { data } = await api.delete<WarehouseResponse>(`/warehouses/${id}`);
  return data;
};
