"use client";

import { User, Calendar, TrendingUp, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard";
import { useQuery } from "@tanstack/react-query";
import { savingsApi } from "@/lib/api/savings";
import { useAuth } from "@/lib/auth-context";

const iconMap = {
  User,
  Calendar,
  TrendingUp,
  Wallet,
};

export default function UserPage() {
  const { user } = useAuth();
  const { data: summary, isLoading, error } = useQuery({
    queryKey: ["savings-summary"],
    queryFn: () => savingsApi.getSummary(),
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Balance",
      value: `₹${summary?.total?.toFixed(2) ?? "0.00"}`,
      subtitle: "All-time savings",
      icon: "User",
    },
    {
      title: "Today",
      value: `₹${summary?.daily?.toFixed(2) ?? "0.00"}`,
      subtitle: "Daily savings",
      icon: "Calendar",
    },
    {
      title: "This Week",
      value: `₹${summary?.weekly?.toFixed(2) ?? "0.00"}`,
      subtitle: "Weekly savings",
      icon: "TrendingUp",
    },
    {
      title: "This Month",
      value: `₹${summary?.monthly?.toFixed(2) ?? "0.00"}`,
      subtitle: "Monthly savings",
      icon: "Wallet",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome, {user?.name}. Your savings at a glance.
        </p>
      </div>

      {error && (
        <p className="text-destructive">
          Failed to load summary: {(error as Error).message}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </div>
  );
}
