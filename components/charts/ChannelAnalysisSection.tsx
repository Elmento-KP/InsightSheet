"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChannelAnalysis } from "@/lib/dashboardTypes";
import { formatAxisValue, formatSmartNumber } from "@/utils/format";
import SectionCard from "@/components/dashboard/SectionCard";

type ChannelAnalysisSectionProps = {
  analysis: ChannelAnalysis;
};

export default function ChannelAnalysisSection({
  analysis,
}: ChannelAnalysisSectionProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SectionCard
        title="Orders by Channel"
        subtitle={`Order count grouped by ${analysis.channelColumn}`}
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.ordersByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
              <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
              <Tooltip formatter={(value: number) => formatSmartNumber(value)} />
              <Bar dataKey="value" fill="#2563eb" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard
        title="Revenue by Channel"
        subtitle="Revenue comparison across channels"
      >
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analysis.revenueByChannel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" tickLine={false} />
              <YAxis
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={formatAxisValue}
              />
              <Tooltip formatter={(value: number) => formatSmartNumber(value)} />
              <Bar dataKey="value" fill="#0f766e" radius={[12, 12, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>
    </div>
  );
}
