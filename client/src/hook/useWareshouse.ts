import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createWarehouse,
  deleteWarehouse,
  getWarehouseById,
  getWarehouses,
  getWarehouseSummary,
  updateWarehouse,
} from "../services/warehouse.service";
import type { WarehousePayload, WarehouseQuery } from "../type/warehouse";

export const useGetWarehouses = (params: WarehouseQuery) => {
  return useQuery({
    queryKey: ["warehouses", "list", params],
    queryFn: () => getWarehouses(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetWarehouseSummary = () => {
  return useQuery({
    queryKey: ["warehouses", "summary"],
    queryFn: getWarehouseSummary,
  });
};

export const useGetWarehouseById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["warehouses", "detail", id],
    queryFn: () => getWarehouseById(id),
    enabled: enabled && id > 0,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWarehouse,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "summary"],
        }),
      ]);
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<WarehousePayload>;
    }) => updateWarehouse(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "summary"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "detail", variables.id],
        }),
      ]);
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["warehouses", "summary"],
        }),
      ]);
    },
  });
};
