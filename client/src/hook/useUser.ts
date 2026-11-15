import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { UserPayload, UserQuery } from "../type/user";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  getUserSummary,
  updateUser,
} from "../services/user.service";

export const useGetUsers = (params: UserQuery) => {
  return useQuery({
    queryKey: ["users", "list", params],
    queryFn: () => getUsers(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetUserSummary = () => {
  return useQuery({
    queryKey: ["users", "summary"],
    queryFn: () => getUserSummary(),
  });
};

export const useGetUserById = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ["users", "detail", id],
    queryFn: () => getUserById(id),
    enabled: enabled && id > 0,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "summary"],
        }),
      ]);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<UserPayload>;
    }) => updateUser(id, payload),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "summary"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "detail", variables.id],
        }),
      ]);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["users", "list"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["users", "summary"],
        }),
      ]);
    },
  });
};
