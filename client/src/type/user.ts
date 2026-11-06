import type { ApiResponse, PaginationQuery } from "./api";

export interface UserItem {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  password: string;
  role: string;
  is_active: boolean;
}

export type UserSortBy = "name" | "createdAt";

export interface UserQuery extends PaginationQuery {
  isActive?: boolean;
  sortBy?: UserSortBy;
  sortOrder?: "asc" | "desc";
}

export type UserListResponse = ApiResponse<UserItem[]>;
export type UserResponse = ApiResponse<UserItem>;
