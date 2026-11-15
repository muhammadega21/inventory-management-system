import type { ApiResponse, PaginationQuery } from "./api";

export type UserRole = "ADMIN" | "STAFF";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  is_active: boolean;
}

export interface UserSummary {
  usersCount: number;
  adminCount: number;
  staffCount: number;
  activeUsers: number;
  inactiveUsers: number;
}

export type UserSortBy = "name" | "createdAt";

export interface UserQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: UserSortBy;
  sortOrder?: "asc" | "desc";
  role?: UserRole;
}

export type UserListResponse = ApiResponse<UserItem[]>;
export type UserResponse = ApiResponse<UserItem>;
export type UserSummaryResponse = ApiResponse<UserSummary>;
