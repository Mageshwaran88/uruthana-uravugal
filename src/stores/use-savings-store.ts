/**
 * Zustand store for savings state - reusable across user and admin UI
 */

import { create } from "zustand";
import type {
  SavingsRecord,
  SavingsSummary,
  SavingsFilters,
  AdminUserSavings,
  AdminOverallTotal,
} from "@/lib/api/savings";
import { savingsApi } from "@/lib/api/savings";

interface SavingsState {
  records: SavingsRecord[];
  summary: SavingsSummary | null;
  adminByUser: AdminUserSavings[];
  adminOverall: AdminOverallTotal | null;
  meta: { total: number; page: number; limit: number; totalPages: number } | null;
  isLoading: boolean;
  error: string | null;

  fetchAll: (params?: SavingsFilters) => Promise<void>;
  fetchById: (id: string) => Promise<SavingsRecord | null>;
  fetchSummary: (userId?: string) => Promise<void>;
  fetchAdminOverall: () => Promise<void>;
  fetchAdminByUser: () => Promise<void>;

  create: (body: { amount: number; date: string; note?: string }) => Promise<void>;
  creditDebit: (body: {
    userId: string;
    amount: number;
    type: "CREDIT" | "DEBIT";
    date: string;
    note?: string;
  }) => Promise<void>;
  update: (id: string, body: { amount?: number; date?: string; note?: string }) => Promise<void>;
  remove: (id: string) => Promise<void>;

  downloadReport: (params?: SavingsFilters) => Promise<void>;

  clear: () => void;
}

export const useSavingsStore = create<SavingsState>((set, get) => ({
  records: [],
  summary: null,
  adminByUser: [],
  adminOverall: null,
  meta: null,
  isLoading: false,
  error: null,

  fetchAll: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const res = await savingsApi.getAll(params);
      set({ records: res.data, meta: res.meta });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchById: async (id) => {
    try {
      return await savingsApi.getById(id);
    } catch {
      return null;
    }
  },

  fetchSummary: async (userId) => {
    try {
      const summary = await savingsApi.getSummary(userId);
      set({ summary });
    } catch {
      set({ summary: null });
    }
  },

  fetchAdminOverall: async () => {
    try {
      const adminOverall = await savingsApi.getAdminOverall();
      set({ adminOverall });
    } catch {
      set({ adminOverall: null });
    }
  },

  fetchAdminByUser: async () => {
    try {
      const adminByUser = await savingsApi.getAdminByUser();
      set({ adminByUser });
    } catch {
      set({ adminByUser: [] });
    }
  },

  create: async (body) => {
    set({ isLoading: true, error: null });
    try {
      await savingsApi.create(body);
      await get().fetchAll();
      await get().fetchSummary();
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  creditDebit: async (body) => {
    set({ isLoading: true, error: null });
    try {
      await savingsApi.creditDebit(body);
      await get().fetchAll();
      await get().fetchSummary();
      await get().fetchAdminOverall();
      await get().fetchAdminByUser();
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  update: async (id, body) => {
    set({ isLoading: true, error: null });
    try {
      await savingsApi.update(id, body);
      await get().fetchAll();
      await get().fetchSummary();
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  remove: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await savingsApi.delete(id);
      await get().fetchAll();
      await get().fetchSummary();
    } catch (e) {
      set({ error: (e as Error).message });
      throw e;
    } finally {
      set({ isLoading: false });
    }
  },

  downloadReport: async (params) => {
    await savingsApi.downloadReport(params);
  },

  clear: () =>
    set({
      records: [],
      summary: null,
      adminByUser: [],
      adminOverall: null,
      meta: null,
      error: null,
    }),
}));
