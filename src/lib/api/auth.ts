/**
 * Auth API - using common api client
 */

import { apiPost, apiGet } from "./client";

export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string | null;
  mobile?: string | null;
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

export type OtpPurpose = "REGISTER" | "FORGOT_PASSWORD";
export type OtpChannel = "EMAIL" | "SMS";

export const authApi = {
  login: (body: { identifier: string; password: string }) =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/login",
      body
    ),

  register: (body: { email: string; otp: string; password: string; username?: string; mobile?: string }) =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/register",
      body
    ),

  registerWithPhone: (body: { firebaseIdToken: string; password: string }) =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/register-with-phone",
      body
    ),

  logout: () => apiPost<{ success: boolean }>("/auth/logout"),

  refresh: () =>
    apiPost<{ success: boolean; token: string; user: User; expiresIn: number }>(
      "/auth/refresh"
    ),

  me: () => apiGet<User>("/auth/me"),

  forgotPassword: (body: { email: string }) =>
    apiPost<{ message: string }>("/auth/forgot-password", body),

  sendOtp: (body: {
    identifier: string;
    purpose: OtpPurpose;
    channel?: OtpChannel;
  }) => apiPost<{ message: string }>("/auth/send-otp", body),

  verifyOtp: (body: {
    identifier: string;
    purpose: OtpPurpose;
    otp: string;
  }) => apiPost<{ valid: boolean }>("/auth/verify-otp", body),

  resetPasswordWithOtp: (body: {
    identifier: string;
    otp: string;
    newPassword: string;
  }) => apiPost<{ message: string }>("/auth/reset-password-with-otp", body),

  changePassword: (body: {
    currentPassword: string;
    newPassword: string;
  }) => apiPost<{ message: string }>("/auth/change-password", body),
};
