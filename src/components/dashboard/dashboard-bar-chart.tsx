"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export interface BarChartDataItem {
  [key: string]: string | number;
}

export interface DashboardBarChartProps {
  title: string;
  data: BarChartDataItem[];
  dataKey: string;
  nameKey: string;
  className?: string;
  fill?: string;
}

export function DashboardBarChart({
  title,
  data,
  dataKey,
  nameKey,
  className,
  fill = "var(--color-primary)",
}: DashboardBarChartProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey={nameKey} className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
              <YAxis className="text-xs" tick={{ fill: "var(--color-muted-foreground)" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-md)",
                }}
                labelStyle={{ color: "var(--color-foreground)" }}
              />
              <Bar dataKey={dataKey} fill={fill} radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
