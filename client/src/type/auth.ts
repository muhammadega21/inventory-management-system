import type { ApiResponse } from "./api";

export type UserRole = "ADMIN" | "STAFF";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
}

export interface LoginResponseData {
  user: AuthUser;
}

export type LoginResponse = ApiResponse<LoginResponseData>;
