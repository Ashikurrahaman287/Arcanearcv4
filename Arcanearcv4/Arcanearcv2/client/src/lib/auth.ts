import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  token: string | null;
}

export function getAuthState(): AuthState {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  return { user, token };
}

export function setAuthState(user: User, token: string) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuthState() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}
