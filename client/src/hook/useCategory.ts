import { useQuery } from "@tanstack/react-query";
import {
  getActiveCategories,
  getCategories,
} from "../services/category.service";

// Parameter enabled bisa dipakai modal agar tidak mengambil data saat tertutup.
export const useGetCategories = (enabled = true) => {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
};

export const useGetActiveCategories = () => {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: getActiveCategories,
    staleTime: 1000 * 60 * 5,
  });
};
