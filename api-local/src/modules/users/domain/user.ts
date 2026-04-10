export type UserRole = "admin" | "manager" | "support";
export type UserStatus = "active" | "inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface UserPayload {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}
