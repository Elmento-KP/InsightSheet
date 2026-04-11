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
import type { DashboardAnalysis } from "@/lib/dashboardTypes";
import { formatAxisValue, formatSmartNumber } from "@/utils/format";
import SectionCard from "@/components/dashboard/SectionCard";

type TrendForecastChartProps = {
  analysis: DashboardAnalysis;
};

export default function TrendForecastChart({
  analysis,
}: TrendForecastChartProps) {
  return (
    <SectionCard
      title="Trend and Forecast"
      subtitle={
        analysis.hasDateData
          ? "Date-sorted trend with blended regression and moving-average forecasting for the next 7 to 30 periods."
          : "Trend line based on row order because no valid date column is currently selected."
      }
      className="xl:col-span-2"
    >
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={analysis.trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" stroke="#64748b" tickLine={false} />
            <YAxis
              stroke="#64748b"
              tickLine={false}
              axisLine={false}
              tickFormatter={formatAxisValue}
            />
            <Tooltip formatter={(value: number) => formatSmartNumber(value)} />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 3 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="forecast"
              name="Forecast"
              stroke="#f97316"
              strokeDasharray="6 6"
              strokeWidth={3}
              dot={{ r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </SectionCard>
  );
}
