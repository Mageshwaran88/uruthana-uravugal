/**
 * Dashboard API - uses common api client
 */

import { apiGet } from "./client";

export interface DashboardStats {
  totalUsers: number;
  totalAdmins: number;
  totalRegularUsers: number;
  usersThisWeek: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  [key: string]: string | number;
}

export interface DashboardReport {
  stats: DashboardStats;
  barChart: {
    title: string;
    dataKey: string;
    nameKey: string;
    data: ChartDataPoint[];
  };
  lineChart: {
    title: string;
    dataKey: string;
    nameKey: string;
    data: ChartDataPoint[];
  };
}

export const dashboardApi = {
  getReport: () => apiGet<DashboardReport>("/dashboard/report"),
};
