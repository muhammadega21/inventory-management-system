import { useQuery } from "@tanstack/react-query";
import {
  getActiveCategories,
  getCategories,
} from "../services/category.service";

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories", "list"],
    queryFn: () => getCategories(),
    staleTime: 1000 * 60 * 5,
  });
};

export const useGetActiveCategories = () => {
  return useQuery({
    queryKey: ["categories", "active"],
    queryFn: getActiveCategories,
    staleTime: 1000 * 60 * 5,
  });
};
