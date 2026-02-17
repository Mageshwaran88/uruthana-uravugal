"use client";

import { LayoutDashboard, Activity } from "lucide-react";
import { StatCard, DashboardBarChart, DashboardLineChart } from "@/components/dashboard";
import dashboardData from "@/data/dashboard-common.json";

const iconMap = {
  LayoutDashboard,
  Activity,
};

export default function DashboardPage() {
  const { stats, barChart, lineChart } = dashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview and quick stats. Use the sidebar to open User or Admin views.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="grid gap-6 md:grid-cols-2">
        <DashboardBarChart
          title={barChart.title}
          data={barChart.data}
          dataKey={barChart.dataKey}
          nameKey={barChart.nameKey}
        />
        <DashboardLineChart
          title={lineChart.title}
          data={lineChart.data}
          dataKey={lineChart.dataKey}
          nameKey={lineChart.nameKey}
        />
      </div>
    </div>
  );
}
