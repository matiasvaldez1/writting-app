"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTranslations } from "next-intl";

export function SessionDurationChart({
  userAnalytics,
}: {
  userAnalytics: {
    id: number;
    userId: number;
    createdAt: Date;
    type: "sessionDuration" | "pageView";
    value: number;
  }[];
}) {
  const t = useTranslations("dashboard.chart");
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <ResponsiveContainer width="100%" height={330}>
        <LineChart
          data={userAnalytics.map((userAnalytic) => ({
            duration: (userAnalytic.value / 60).toFixed(2),
            date: new Date(userAnalytic.createdAt).toLocaleDateString(),
          }))}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--border))"
            fontSize={12}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <YAxis
            stroke="hsl(var(--border))"
            fontSize={12}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
              color: "hsl(var(--foreground))",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            name={t("sessionDuration")}
            dataKey="duration"
            stroke="#6366f1"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
