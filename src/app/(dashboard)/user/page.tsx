"use client";

import { User, Target, TrendingUp } from "lucide-react";
import { StatCard, DashboardBarChart, DashboardLineChart } from "@/components/dashboard";
import userData from "@/data/user-dashboard.json";

const iconMap = {
  User,
  Target,
  TrendingUp,
};

export default function UserPage() {
  const { stats, barChart, lineChart } = userData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          View your savings progress, profile, and goals.
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
