"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";

export interface LineChartDataItem {
  [key: string]: string | number;
}

export interface DashboardLineChartProps {
  title: string;
  data: LineChartDataItem[];
  dataKey: string;
  nameKey: string;
  className?: string;
  stroke?: string;
}

export function DashboardLineChart({
  title,
  data,
  dataKey,
  nameKey,
  className,
  stroke = "var(--color-chart-1)",
}: DashboardLineChartProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={stroke}
                strokeWidth={2}
                dot={{ fill: stroke, r: 4 }}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
