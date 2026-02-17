/**
 * Auth API - using common api client
 */

import { apiPost, apiGet } from "./client";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  expiresIn?: number;
  error?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/login",
      { email, password }
    ),

  register: (name: string, email: string, password: string) =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/register",
      { name, email, password }
    ),

  logout: () => apiPost<{ success: boolean }>("/auth/logout"),

  refresh: () =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/refresh"
    ),

  me: () => apiGet<User>("/auth/me"),
};
