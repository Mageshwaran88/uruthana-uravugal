"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, PiggyBank, TrendingUp } from "lucide-react";
import { StatCard, DashboardBarChart, DashboardLineChart } from "@/components/dashboard";
import { apiGet } from "@/lib/api/client";
import { Button } from "@/components/ui/button";

const iconMap = {
  Shield,
  Users,
  PiggyBank,
  TrendingUp,
};

interface AdminSavingsReport {
  totalSavings: number;
  userCount: number;
  byUser: Array<{ userId: string; userName: string; totalAmount: number }>;
  trend: Array<{ label: string; value: number }>;
}

export default function AdminPage() {
  const { data: report, isLoading, error } = useQuery({
    queryKey: ["admin-savings-report"],
    queryFn: () =>
      apiGet<AdminSavingsReport>("/dashboard/admin/savings-report"),
  });

  const stats = report
    ? [
        {
          title: "Total Savings",
          value: `₹${report.totalSavings.toFixed(2)}`,
          subtitle: "Overall balance",
          icon: "PiggyBank",
        },
        {
          title: "Users with savings",
          value: String(report.userCount),
          subtitle: "Active savers",
          icon: "Users",
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overall savings and user management.
          </p>
        </div>
        <Link href="/admin/users">
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            View all users
          </Button>
        </Link>
      </div>

      {error && (
        <p className="text-destructive">
          Failed to load report: {(error as Error).message}
        </p>
      )}

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-32 rounded-lg bg-muted animate-pulse" />
          <div className="h-32 rounded-lg bg-muted animate-pulse" />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.map((stat) => {
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
      )}

      {report?.byUser?.length ? (
        <DashboardBarChart
          title="Savings by user"
          data={report.byUser.map((u) => ({
            label: u.userName,
            value: u.totalAmount,
          }))}
          dataKey="value"
          nameKey="label"
        />
      ) : null}

      {report?.trend?.length ? (
        <DashboardLineChart
          title="Daily savings trend (last 7 days)"
          data={report.trend}
          dataKey="value"
          nameKey="label"
        />
      ) : null}
    </div>
  );
}
