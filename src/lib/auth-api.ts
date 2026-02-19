/**
 * Auth API - uses common api client, re-exports for auth-context
 */

import { apiPost, apiGet } from "./api/client";
import type { User } from "./api/auth";

export type { User };

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  expiresIn?: number;
  error?: string;
}

function normalizeUser(u: { role?: string }): User {
  return { ...u, role: (u.role ?? "user").toLowerCase() } as User;
}

export async function loginAPI(identifier: string, password: string): Promise<AuthResponse> {
  try {
    const data = await apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/login",
      { identifier, password }
    );
    return { success: true, token: data.token, user: normalizeUser(data.user), expiresIn: data.expiresIn };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function registerAPI(params: {
  email: string;
  otp: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const data = await apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/register",
      params
    );
    return { success: true, token: data.token, user: normalizeUser(data.user), expiresIn: data.expiresIn };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function registerWithPhoneAPI(params: {
  firebaseIdToken: string;
  password: string;
}): Promise<AuthResponse> {
  try {
    const data = await apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/register-with-phone",
      params
    );
    return { success: true, token: data.token, user: normalizeUser(data.user), expiresIn: data.expiresIn };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function logoutAPI(): Promise<void> {
  try {
    await apiPost("/auth/logout");
  } catch {
    // Clear local state even if API fails
  }
}

export async function refreshTokenAPI(): Promise<AuthResponse> {
  try {
    const data = await apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/refresh"
    );
    return { success: true, token: data.token, user: normalizeUser(data.user), expiresIn: data.expiresIn };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

export async function meAPI(): Promise<User | null> {
  try {
    const data = await apiGet<User>("/auth/me");
    return data ? normalizeUser(data) : null;
  } catch {
    return null;
  }
}
