import type { DashboardAnalysis, DataRow, InsightItem } from "@/lib/dashboardTypes";

export const generateInsights = (
  data: DataRow[],
  analysis: DashboardAnalysis
): InsightItem[] => {
  if (!data.length) {
    return [];
  }

  const insights: InsightItem[] = [];
  const {
    metricColumn,
    kpis,
    topCategory,
    topCategoryValue,
    rowCount,
    validMetricCount,
  } = analysis;

  if (kpis.total > 0 && topCategory !== "N/A") {
    const percentage = ((topCategoryValue / kpis.total) * 100).toFixed(1);
    insights.push({
      type: "category",
      text: `${topCategory} leads the dataset with ${percentage}% of total ${metricColumn}.`,
    });
  }

  if (validMetricCount < rowCount) {
    insights.push({
      type: "quality",
      text: `${rowCount - validMetricCount} rows were skipped for KPI and chart calculations because ${metricColumn} was not numeric.`,
    });
  }

  if (analysis.trendData.length >= 4) {
    const midpoint = Math.floor(analysis.trendData.length / 2);
    const firstHalf = analysis.trendData.slice(0, midpoint);
    const secondHalf = analysis.trendData.slice(midpoint);

    const firstHalfTotal = firstHalf.reduce(
      (sum, item) => sum + (item.actual ?? 0),
      0
    );
    const secondHalfTotal = secondHalf.reduce(
      (sum, item) => sum + (item.actual ?? 0),
      0
    );

    if (firstHalfTotal > 0) {
      const delta = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
      const direction = delta >= 0 ? "grew" : "declined";

      insights.push({
        type: "trend",
        text: `${metricColumn} ${direction} by ${Math.abs(delta).toFixed(1)}% in the second half of the visible trend window.`,
      });
    }
  }

  insights.push({
    type: "summary",
    text: `Average ${metricColumn} is ${kpis.average.toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}, with values ranging from ${kpis.min.toLocaleString()} to ${kpis.max.toLocaleString()}.`,
  });

  return insights;
};
