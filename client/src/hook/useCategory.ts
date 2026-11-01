import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../services/category.service";
import type { CategoryQuery } from "../type/category";

export const useGetCategories = (params: CategoryQuery) => {
  return useQuery({
    queryKey: ["categories", "list", params],
    queryFn: () => getCategories(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetCategoryById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["categories", "detail", id],
    queryFn: () => getCategoryById(id),
    enabled: enabled && id > 0,
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories", "list"],
        }),
      ]);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      updateCategory(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["categories", "detail", variables.id],
        }),
      ]);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories", "list"],
        }),
      ]);
    },
  });
};
