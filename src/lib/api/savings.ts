/**
 * Savings API - all methods using common api client
 */

import { apiGet, apiPost, apiPut, apiDelete, API_BASE, getAuthHeaders } from "./client";

export type TransactionType = "CREDIT" | "DEBIT";

export interface SavingsRecord {
  id: string;
  amount: string;
  type: TransactionType;
  amountEncrypted: string;
  date: string;
  note: string | null;
  contributorName?: string | null;
  userName?: string;
  createdByName: string;
  createdById: string;
  createdAt: string;
}

export interface SavingsSummary {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
}

export interface SavingsListResponse {
  data: SavingsRecord[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface AdminUserSavings {
  userId: string;
  userName: string;
  userEmail: string | null;
  totalAmount: string;
  recordCount: number;
}

export interface AdminOverallTotal {
  total: number;
  userCount: number;
}

export interface SavingsFilters {
  fromDate?: string;
  toDate?: string;
  userId?: string;
  type?: TransactionType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

function queryString(params?: SavingsFilters): string {
  if (!params) return "";
  const q = new URLSearchParams();
  if (params.fromDate) q.set("fromDate", params.fromDate);
  if (params.toDate) q.set("toDate", params.toDate);
  if (params.userId) q.set("userId", params.userId);
  if (params.type) q.set("type", params.type);
  if (params.page) q.set("page", String(params.page));
  if (params.limit) q.set("limit", String(params.limit));
  if (params.sortBy) q.set("sortBy", params.sortBy);
  if (params.sortOrder) q.set("sortOrder", params.sortOrder);
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const savingsApi = {
  getAll: (params?: SavingsFilters) =>
    apiGet<SavingsListResponse>(`/savings${queryString(params)}`),

  getById: (id: string) => apiGet<SavingsRecord>(`/savings/${id}`),

  create: (body: { amount: number; date: string; note?: string; userId?: string }) =>
    apiPost<SavingsRecord>("/savings", body),

  creditDebit: (body: {
    userId: string;
    amount: number;
    type: TransactionType;
    date: string;
    note?: string;
  }) => apiPost<SavingsRecord>("/savings/credit-debit", body),

  update: (id: string, body: { amount?: number; date?: string; note?: string }) =>
    apiPut<SavingsRecord>(`/savings/${id}`, body),

  delete: (id: string) => apiDelete<{ message: string }>(`/savings/${id}`),

  getSummary: (userId?: string) =>
    apiGet<SavingsSummary>(`/savings/summary${userId ? `?userId=${userId}` : ""}`),

  getAdminOverall: () => apiGet<AdminOverallTotal>("/savings/admin/overall"),

  getAdminByUser: () => apiGet<AdminUserSavings[]>("/savings/admin/by-user"),

  downloadReport: async (params?: SavingsFilters): Promise<void> => {
    const res = await fetch(`${API_BASE}/savings/report${queryString(params)}`, {
      headers: getAuthHeaders(),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Download failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `savings-report-${new Date().toISOString().slice(0, 10)}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
