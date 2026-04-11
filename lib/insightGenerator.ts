import type {
  DashboardAnalysis,
  DataRow,
  InsightItem,
} from "@/lib/dashboardTypes";
import { formatSmartNumber } from "@/utils/format";

export const generateInsights = (
  data: DataRow[],
  analysis: DashboardAnalysis
): InsightItem[] => {
  if (!data.length) {
    return [];
  }

  const insights: InsightItem[] = [];

  if (analysis.topCategory !== "N/A" && analysis.topCategoryValue > 0) {
    insights.push({
      type: "category",
      text: `${analysis.topCategory} is the strongest ${analysis.categoryColumn.toLowerCase()} based on ${analysis.aggregationType} ${analysis.activeMetricLabel.toLowerCase()}.`,
    });
  }

  if (analysis.invalidMetricCount > 0) {
    insights.push({
      type: "quality",
      text: `${analysis.invalidMetricCount} rows were skipped because the selected numeric fields were incomplete or invalid.`,
    });
  }

  const historicalTrend = analysis.trendData.filter((point) => !point.isForecast);
  if (historicalTrend.length >= 4) {
    const firstValue = historicalTrend[0]?.actual ?? 0;
    const lastValue = historicalTrend.at(-1)?.actual ?? 0;

    if (firstValue !== 0) {
      const deltaPercent = ((lastValue - firstValue) / Math.abs(firstValue)) * 100;
      insights.push({
        type: "trend",
        text: `${analysis.activeMetricLabel} moved ${deltaPercent >= 0 ? "up" : "down"} by ${Math.abs(deltaPercent).toFixed(1)}% across the visible trend window.`,
      });
    }
  }

  if (analysis.profitAnalysis) {
    insights.push({
      type: "profit",
      text: `Revenue is ${formatSmartNumber(analysis.profitAnalysis.revenue)}, cost is ${formatSmartNumber(analysis.profitAnalysis.cost)}, and overall profit is ${formatSmartNumber(analysis.profitAnalysis.profit)}.`,
    });
  }

  if (analysis.channelAnalysis?.ordersByChannel.length) {
    insights.push({
      type: "channel",
      text: `${analysis.channelAnalysis.ordersByChannel[0]?.name} currently leads channel performance by volume, while channel revenue is available side-by-side for comparison.`,
    });
  }

  insights.push({
    type: "summary",
    text: `Across ${analysis.rowCount} rows, ${analysis.activeMetricLabel.toLowerCase()} averages ${formatSmartNumber(analysis.kpis.average)} and ranges from ${formatSmartNumber(analysis.kpis.min)} to ${formatSmartNumber(analysis.kpis.max)}.`,
  });

  return insights;
};
