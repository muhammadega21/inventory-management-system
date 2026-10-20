import { api } from "../lib/axios";
import type { LoginFormInput } from "../schemas/auth.schema";
import type { ApiResponse } from "../type/api";
import type { AuthUser, LoginResponse } from "../type/auth";

export const login = async (payload: LoginFormInput) => {
  const { data } = await api.post<LoginResponse>("/auth/login", payload);
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get<ApiResponse<AuthUser>>("/auth/me");
  return data.data;
};
