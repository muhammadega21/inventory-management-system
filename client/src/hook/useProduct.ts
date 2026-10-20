import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  getProductSummary,
  updateProduct,
} from "../services/product.service";
import type { ProductQuery } from "../type/product";

export const useGetProducts = (params: ProductQuery) => {
  return useQuery({
    queryKey: ["products", "list", params],
    queryFn: () => getProducts(params),
    placeholderData: keepPreviousData, // kode ini digunakan untuk menampilkan data sebelumnya saat query baru sedang dimuat
  });
};

export const useGetProductSummary = () => {
  return useQuery({
    queryKey: ["products", "summary"],
    queryFn: () => getProductSummary(),
  });
};

export const useGetProductById = (id: number) => {
  return useQuery({
    queryKey: ["products", "detail", id],
    queryFn: () => getProductById(id),
    enabled: Number.isInteger(id) && id > 0, // kode ini digunakan untuk menonaktifkan query jika id tidak valid (misal: undefined, null, atau bukan angka)
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "summary"],
        }),
      ]);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: FormData }) =>
      updateProduct(id, payload),

    // "_" Data hasil response dari updateProduct()
    // "_" digunakan karena tidak membutuhkan response hasil mutation di dalam callback
    // "variables" Objek yang dikirim melalui mutation.mutate()
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "summary"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "detail", variables.id],
        }),
      ]);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["products", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["products", "summary"],
        }),
      ]);
    },
  });
};
