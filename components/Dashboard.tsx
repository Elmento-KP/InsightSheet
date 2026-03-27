"use client";

import type {
  DashboardAnalysis,
  DataRow,
  InsightItem,
  TrendDatum,
} from "@/lib/dashboardTypes";
import ChartSection from "@/components/dashboard/ChartSection";
import DataPreviewTable from "@/components/dashboard/DataPreviewTable";
import InsightList from "@/components/dashboard/InsightList";
import KpiGrid from "@/components/dashboard/KpiGrid";

type DashboardProps = {
  data: DataRow[];
  analysis: DashboardAnalysis;
  forecast: TrendDatum[];
  insights: InsightItem[];
};

export default function Dashboard({
  data,
  analysis,
  forecast,
  insights,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <KpiGrid analysis={analysis} />
      <ChartSection analysis={analysis} forecast={forecast} />
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DataPreviewTable data={data} />
        <InsightList insights={insights} />
      </div>
    </div>
  );
}
