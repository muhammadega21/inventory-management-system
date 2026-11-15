import { api } from "../lib/axios";
import type {
  UserListResponse,
  UserPayload,
  UserQuery,
  UserResponse,
  UserSummaryResponse,
} from "../type/user";

export const getUsers = async (params: UserQuery) => {
  const { isActive, role, ...query } = params;
  const { data } = await api.get<UserListResponse>("/users", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
      ...(role ? { role } : {}),
    },
  });

  return data;
};

export const getUserSummary = async () => {
  const { data } = await api.get<UserSummaryResponse>("/users/summary");
  return data;
};

export const getUserById = async (id: number) => {
  const { data } = await api.get<UserResponse>(`/users/${id}`);
  return data;
};

export const createUser = async (payload: UserPayload) => {
  const { data } = await api.post<UserResponse>("/users", payload);
  return data;
};

export const updateUser = async (id: number, payload: Partial<UserPayload>) => {
  const { data } = await api.patch<UserResponse>(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id: number) => {
  const { data } = await api.delete<UserResponse>(`/users/${id}`);
  return data;
};
