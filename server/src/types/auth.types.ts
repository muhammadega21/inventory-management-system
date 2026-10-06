export type UserRole = "ADMIN" | "STAFF";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  is_active: boolean;
}
