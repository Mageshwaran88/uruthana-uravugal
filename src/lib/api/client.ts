/**
 * Common API client - reusable for all backend calls
 * Handles: base URL, auth headers, credentials, error parsing, optional toast
 */

import { toast } from "sonner";

export const API_BASE =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api")
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function getAuthHeaders(customHeaders?: HeadersInit): HeadersInit {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  };
}

export interface ApiOptions extends RequestInit {
  skipToast?: boolean;
  skipError?: boolean;
  rawResponse?: boolean;
}

function showErrorToast(msg: string) {
  if (typeof window !== "undefined") {
    toast.error(msg);
  }
}

export async function api<T>(
  path: string,
  init?: ApiOptions
): Promise<T> {
  const { skipToast, skipError, rawResponse, ...fetchInit } = init ?? {};
  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchInit,
    headers: {
      ...getAuthHeaders(),
      ...fetchInit.headers,
    } as HeadersInit,
    credentials: "include",
  });

  if (rawResponse) return res as unknown as T;

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      (Array.isArray(data.message) ? data.message[0] : data.message) ||
      data.error ||
      "Request failed";
    if (!skipToast) showErrorToast(msg);
    if (!skipError) throw new Error(msg);
    return data as T;
  }

  return data as T;
}

export const apiGet = <T>(path: string, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "GET" });
export const apiPost = <T>(path: string, body?: unknown, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "POST", body: body ? JSON.stringify(body) : undefined });
export const apiPut = <T>(path: string, body?: unknown, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "PUT", body: body ? JSON.stringify(body) : undefined });
export const apiPatch = <T>(path: string, body?: unknown, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "PATCH", body: body ? JSON.stringify(body) : undefined });
export const apiDelete = <T>(path: string, opts?: ApiOptions) =>
  api<T>(path, { ...opts, method: "DELETE" });
