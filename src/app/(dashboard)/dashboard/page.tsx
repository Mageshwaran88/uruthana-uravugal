"use client";

import { LayoutDashboard, Activity, Users, UserPlus } from "lucide-react";
import { StatCard, DashboardBarChart, DashboardLineChart } from "@/components/dashboard";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";
import { useAuth } from "@/lib/auth-context";

const iconMap = {
  LayoutDashboard,
  Activity,
  Users,
  UserPlus,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["dashboard-report"],
    queryFn: () => dashboardApi.getReport(),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-[340px] rounded-lg bg-muted animate-pulse" />
          <div className="h-[340px] rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
          <p>Failed to load dashboard: {(error as Error).message}</p>
          <button
            onClick={() => refetch()}
            className="mt-4 rounded-md bg-destructive/20 px-4 py-2 text-sm font-medium hover:bg-destructive/30"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const barChart = data?.barChart;
  const lineChart = data?.lineChart;

  const statCards = stats
    ? [
        {
          title: "Total Users",
          value: String(stats.totalUsers),
          subtitle: "All registered users",
          icon: "Users",
        },
        {
          title: "Admins",
          value: String(stats.totalAdmins),
          subtitle: "Admin accounts",
          icon: "UserPlus",
        },
        {
          title: "New This Week",
          value: String(stats.usersThisWeek),
          subtitle: "Signups in last 7 days",
          icon: "Activity",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.name}. Live stats from your backend.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = iconMap[stat.icon as keyof typeof iconMap];
          return (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={Icon}
            />
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {barChart && (
          <DashboardBarChart
            title={barChart.title}
            data={barChart.data}
            dataKey={barChart.dataKey}
            nameKey={barChart.nameKey}
          />
        )}
        {lineChart && (
          <DashboardLineChart
            title={lineChart.title}
            data={lineChart.data}
            dataKey={lineChart.dataKey}
            nameKey={lineChart.nameKey}
          />
        )}
      </div>
    </div>
  );
}
