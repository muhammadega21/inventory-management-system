import { api } from "../lib/axios";
import type { UserListResponse, UserQuery } from "../type/user";

export const getUsers = async (params: UserQuery) => {
  const { isActive, ...query } = params;
  const { data } = await api.get<UserListResponse>("/categories", {
    params: {
      ...query,
      ...(isActive === undefined ? {} : { is_active: isActive }),
    },
  });

  return data;
};
