/**
 * Users API - profile, avatar, update
 */

import { apiGet, apiPut, API_BASE, getAuthHeaders } from "./client";

export interface ProfileUser {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  avatarUrl: string | null;
  role: string;
  emailVerifiedAt: string | null;
  mobileVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function getAvatarUrl(avatarUrl: string | null | undefined): string {
  if (!avatarUrl) return "";
  const base = API_BASE.replace(/\/api\/?$/, "");
  return avatarUrl.startsWith("http") ? avatarUrl : `${base}${avatarUrl}`;
}

export interface UsersListResponse {
  data: ProfileUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const usersApi = {
  me: () => apiGet<ProfileUser>("/users/me"),

  list: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set("page", String(params.page));
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.search) q.set("search", params.search);
    if (params?.role) q.set("role", params.role);
    if (params?.sortBy) q.set("sortBy", params.sortBy);
    if (params?.sortOrder) q.set("sortOrder", params.sortOrder);
    const s = q.toString();
    return apiGet<UsersListResponse>(`/users${s ? `?${s}` : ""}`);
  },

  getById: (id: string) => apiGet<ProfileUser>(`/users/${id}`),

  updateMe: (body: { name?: string; email?: string; mobile?: string }) =>
    apiPut<ProfileUser>("/users/me", body),

  uploadAvatar: async (file: File): Promise<ProfileUser> => {
    const formData = new FormData();
    formData.append("file", file);
    const headers = new Headers(getAuthHeaders());
    headers.delete("Content-Type");
    const res = await fetch(`${API_BASE}/users/me/avatar`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data.message || data.error || "Upload failed";
      throw new Error(Array.isArray(msg) ? msg[0] : msg);
    }
    return res.json();
  },
};
