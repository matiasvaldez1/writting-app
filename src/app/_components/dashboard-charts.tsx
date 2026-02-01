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
    <ResponsiveContainer width="100%" height={330}>
      <LineChart
        data={userAnalytics.map((userAnalytic) => ({
          duration: (userAnalytic.value / 60).toFixed(2),
          date: new Date(userAnalytic.createdAt).toLocaleDateString(),
        }))}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          name={t("sessionDuration")}
          dataKey="duration"
          stroke="#8884d8"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
