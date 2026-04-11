"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DashboardAnalysis } from "@/lib/dashboardTypes";
import { formatAxisValue, formatSmartNumber } from "@/utils/format";
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

type CategoryChartsProps = {
  analysis: DashboardAnalysis;
};

export default function CategoryCharts({ analysis }: CategoryChartsProps) {
  return (
    <>
      <SectionCard
        title="Category Performance"
        subtitle={`Top ${analysis.categoryData.length} ${analysis.categoryColumn} values by ${analysis.aggregationType} ${analysis.activeMetricLabel.toLowerCase()}`}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.categoryData} barCategoryGap={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatAxisValue}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                formatter={(value: number) => formatSmartNumber(value)}
              />
              <Bar dataKey="value" fill="#0f766e" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Category Share"
        subtitle={`${analysis.topCategory} contributes ${formatSmartNumber(analysis.topCategoryValue)} ${analysis.activeMetricLabel.toLowerCase()}`}
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
              <Tooltip formatter={(value: number) => formatSmartNumber(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </>
  );
}
