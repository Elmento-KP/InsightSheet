import type { DashboardAnalysis, DataRow } from "@/lib/dashboardTypes";

export const buildDatasetSummary = (
  rawData: DataRow[],
  analysis: DashboardAnalysis
) => {
  const previewRows = rawData.slice(0, 5);

  return {
    rowCount: rawData.length,
    metricColumn: analysis.metricColumn,
    categoryColumn: analysis.categoryColumn,
    dateColumn: analysis.dateColumn,
    aggregationType: analysis.aggregationType,
    activeMetricLabel: analysis.activeMetricLabel,
    kpis: analysis.kpis,
    topCategory: analysis.topCategory,
    topCategoryValue: analysis.topCategoryValue,
    categoryData: analysis.categoryData.slice(0, 6),
    trendData: analysis.trendData.slice(0, 12),
    profitAnalysis: analysis.profitAnalysis,
    channelAnalysis: analysis.channelAnalysis,
    previewRows,
  };
};
