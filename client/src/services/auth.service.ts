import { api } from "../lib/axios";
import type { LoginFormInput } from "../schemas/auth.schema";

export const login = async (payload: LoginFormInput) => {
  const { data } = await api.post("/auth/login", payload);
  return data.data;
};

export const logout = async () => {
  const { data } = await api.post("/auth/logout");
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};
