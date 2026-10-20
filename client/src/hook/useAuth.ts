import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout } from "../services/auth.service";
import type { AuthUser } from "../type/auth";

export const authQueryKey = ["auth"] as const;

export const useMe = () => {
  return useQuery<AuthUser | null>({
    queryKey: authQueryKey,
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(authQueryKey, data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(authQueryKey, null);
    },
  });
};
