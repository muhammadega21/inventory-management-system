import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { SupplierPayload, SupplierQuery } from "../type/supplier";
import {
  createSupplier,
  deleteSupplier,
  getSupplierById,
  getSuppliers,
  updateSupplier,
} from "../services/supplier.service";

export const useGetSuppliers = (params: SupplierQuery) => {
  return useQuery({
    queryKey: ["suppliers", "list", params],
    queryFn: () => getSuppliers(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetSupplierById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["suppliers", "detail", id],
    queryFn: () => getSupplierById(id),
    enabled: enabled && id > 0,
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSupplier,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", "list"],
      });
    },
  });
};

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<SupplierPayload>;
    }) => updateSupplier(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["suppliers", "detail", variables.id],
        }),
      ]);
    },
  });
};

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers", "list"],
      });
    },
  });
};
