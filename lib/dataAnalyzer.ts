import type {
  ColumnSelection,
  DashboardAnalysis,
  DataRow,
  TrendDatum,
} from "@/lib/dashboardTypes";

const formatTrendLabel = (value: string | number | null, index: number) => {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return `Row ${index + 1}`;
};

export const analyzeData = (
  data: DataRow[],
  selection: ColumnSelection
): DashboardAnalysis | null => {
  if (!data.length || !selection.metricColumn || !selection.categoryColumn) {
    return null;
  }

  const metricValues = data
    .map((row) => Number(row[selection.metricColumn]))
    .filter((value) => Number.isFinite(value));

  if (!metricValues.length) {
    return null;
  }

  const total = metricValues.reduce((sum, value) => sum + value, 0);
  const average = total / metricValues.length;
  const min = Math.min(...metricValues);
  const max = Math.max(...metricValues);

  const categoryMap = new Map<string, number>();

  data.forEach((row) => {
    const categoryValue = row[selection.categoryColumn];
    const metricValue = Number(row[selection.metricColumn]);

    if (!Number.isFinite(metricValue)) {
      return;
    }

    const category =
      typeof categoryValue === "string" && categoryValue.trim().length > 0
        ? categoryValue
        : "Unknown";

    categoryMap.set(category, (categoryMap.get(category) ?? 0) + metricValue);
  });

  const categoryData = [...categoryMap.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((first, second) => second.value - first.value)
    .slice(0, 8);

  const topCategory = categoryData[0]?.name ?? "N/A";
  const topCategoryValue = categoryData[0]?.value ?? 0;

  const rawTrendData: Array<TrendDatum | null> = data
    .map((row, index) => {
      const metricValue = Number(row[selection.metricColumn]);
      if (!Number.isFinite(metricValue)) {
        return null;
      }

      return {
        label: formatTrendLabel(row[selection.dateColumn], index),
        actual: metricValue,
        forecast: null,
        isForecast: false,
      };
    });

  const trendData = rawTrendData
    .filter((value): value is TrendDatum => value !== null)
    .slice(0, 24);

  return {
    metricColumn: selection.metricColumn,
    categoryColumn: selection.categoryColumn,
    dateColumn: selection.dateColumn,
    rowCount: data.length,
    validMetricCount: metricValues.length,
    kpis: {
      total,
      average,
      min,
      max,
    },
    topCategory,
    topCategoryValue,
    categoryData,
    trendData,
  };
};
