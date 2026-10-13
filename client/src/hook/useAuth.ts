import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login, logout } from "../services/auth.service";

export const useMe = () => {
  return useQuery({
    queryKey: ["auth"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 10,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data.user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth"], null);
      queryClient.clear();
    },
  });
};
