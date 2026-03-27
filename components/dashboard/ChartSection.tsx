"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAnalysis, TrendDatum } from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

const PIE_COLORS = [
  "#0f766e",
  "#2563eb",
  "#7c3aed",
  "#f97316",
  "#e11d48",
  "#65a30d",
  "#0891b2",
  "#c026d3",
];

type ChartSectionProps = {
  analysis: DashboardAnalysis;
  forecast: TrendDatum[];
};

export default function ChartSection({
  analysis,
  forecast,
}: ChartSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard
        title="Category Performance"
        subtitle={`Top ${analysis.categoryData.length} ${analysis.categoryColumn} values by ${analysis.metricColumn}`}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.categoryData} barCategoryGap={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: "#f8fafc" }} />
              <Bar dataKey="value" fill="#0f766e" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Category Share"
        subtitle={`${analysis.topCategory} contributes ${analysis.topCategoryValue.toLocaleString()} ${analysis.metricColumn}`}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={analysis.categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
              >
                {analysis.categoryData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Trend and Forecast"
        subtitle="Historical values plus simple linear regression forecast"
        className="xl:col-span-2"
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip />
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
    </div>
  );
}
