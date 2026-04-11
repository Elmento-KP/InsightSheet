import type {
  AggregationType,
  ChartDatum,
  ChannelAnalysis,
  ColumnSelection,
  DashboardAnalysis,
  DataRow,
  ProfitAnalysis,
  ViewMode,
} from "@/lib/dashboardTypes";
import { buildForecastSeries } from "@/utils/forecast";
import { formatDateLabel } from "@/utils/format";

const MAX_CATEGORY_POINTS = 8;

const toNumber = (value: unknown) => {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : null;
};

const toDate = (value: unknown) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  const parsedTimestamp = Date.parse(value);
  return Number.isNaN(parsedTimestamp) ? null : new Date(parsedTimestamp);
};

const aggregateValues = (values: number[], aggregationType: AggregationType) => {
  if (values.length === 0) {
    return 0;
  }

  switch (aggregationType) {
    case "average":
      return values.reduce((sum, value) => sum + value, 0) / values.length;
    case "count":
      return values.length;
    case "max":
      return Math.max(...values);
    case "min":
      return Math.min(...values);
    case "sum":
    default:
      return values.reduce((sum, value) => sum + value, 0);
  }
};

const getPrimaryMetricValue = (
  row: DataRow,
  selection: ColumnSelection,
  viewMode: ViewMode
) => {
  if (viewMode === "profit") {
    const revenue = selection.revenueColumn
      ? toNumber(row[selection.revenueColumn])
      : null;
    const cost = selection.costColumn ? toNumber(row[selection.costColumn]) : null;

    if (revenue === null || cost === null) {
      return null;
    }

    return revenue - cost;
  }

  return selection.metricColumn ? toNumber(row[selection.metricColumn]) : null;
};

const buildCategoryData = (
  data: DataRow[],
  selection: ColumnSelection,
  viewMode: ViewMode
) => {
  const buckets = new Map<string, number[]>();

  data.forEach((row) => {
    const metricValue = getPrimaryMetricValue(row, selection, viewMode);
    if (metricValue === null) {
      return;
    }

    const categoryValue = row[selection.categoryColumn];
    const bucketName =
      typeof categoryValue === "string" && categoryValue.trim().length > 0
        ? categoryValue
        : "Unknown";

    const currentValues = buckets.get(bucketName) ?? [];
    currentValues.push(metricValue);
    buckets.set(bucketName, currentValues);
  });

  return [...buckets.entries()]
    .map(
      ([name, values]): ChartDatum => ({
        name,
        value: Number(
          aggregateValues(values, selection.aggregationType).toFixed(2)
        ),
      })
    )
    .sort((left, right) => right.value - left.value)
    .slice(0, MAX_CATEGORY_POINTS);
};

const buildTrendData = (
  data: DataRow[],
  selection: ColumnSelection,
  viewMode: ViewMode
) => {
  const datedPoints = data
    .map((row, index) => {
      const metricValue = getPrimaryMetricValue(row, selection, viewMode);
      const dateValue = selection.dateColumn ? row[selection.dateColumn] : null;
      const parsedDate = toDate(dateValue);

      if (metricValue === null || !parsedDate) {
        return null;
      }

      return {
        index,
        label: formatDateLabel(parsedDate),
        timestamp: parsedDate.getTime(),
        value: metricValue,
      };
    })
    .filter((point): point is NonNullable<typeof point> => point !== null);

  if (datedPoints.length >= 2) {
    const groupedByDate = new Map<number, number[]>();

    datedPoints.forEach((point) => {
      const currentValues = groupedByDate.get(point.timestamp) ?? [];
      currentValues.push(point.value);
      groupedByDate.set(point.timestamp, currentValues);
    });

    return buildForecastSeries(
      [...groupedByDate.entries()].map(([timestamp, values]) => ({
        label: formatDateLabel(new Date(timestamp)),
        timestamp,
        value: Number(
          aggregateValues(values, selection.aggregationType).toFixed(2)
        ),
      }))
    );
  }

  const fallbackSeries = data
    .map((row, index) => {
      const metricValue = getPrimaryMetricValue(row, selection, viewMode);
      if (metricValue === null) {
        return null;
      }

      return {
        label: `Row ${index + 1}`,
        actual: metricValue,
        forecast: null,
        isForecast: false,
        timestamp: null,
      };
    })
    .filter((point): point is NonNullable<typeof point> => point !== null)
    .slice(0, 24);

  return fallbackSeries;
};

const buildProfitAnalysis = (
  data: DataRow[],
  selection: ColumnSelection
): ProfitAnalysis | null => {
  if (!selection.revenueColumn || !selection.costColumn) {
    return null;
  }

  let revenue = 0;
  let cost = 0;

  data.forEach((row) => {
    const revenueValue = toNumber(row[selection.revenueColumn]);
    const costValue = toNumber(row[selection.costColumn]);

    if (revenueValue !== null) {
      revenue += revenueValue;
    }

    if (costValue !== null) {
      cost += costValue;
    }
  });

  const profit = revenue - cost;
  const marginPercent = revenue > 0 ? (profit / revenue) * 100 : null;

  return {
    revenue,
    cost,
    profit,
    marginPercent,
    status: profit > 0 ? "profit" : profit < 0 ? "loss" : "breakeven",
    isBreakEven: profit >= 0,
  };
};

const buildChannelAnalysis = (
  data: DataRow[],
  selection: ColumnSelection
): ChannelAnalysis | null => {
  if (!selection.channelColumn) {
    return null;
  }

  const channelBuckets = new Map<string, { orders: number; revenue: number }>();

  data.forEach((row) => {
    const channelValue = row[selection.channelColumn];
    const channelName =
      typeof channelValue === "string" && channelValue.trim().length > 0
        ? channelValue
        : "Unknown";
    const currentBucket = channelBuckets.get(channelName) ?? {
      orders: 0,
      revenue: 0,
    };

    currentBucket.orders += 1;

    const revenueColumn = selection.revenueColumn || selection.metricColumn;
    const revenueValue = revenueColumn ? toNumber(row[revenueColumn]) : null;
    if (revenueValue !== null) {
      currentBucket.revenue += revenueValue;
    }

    channelBuckets.set(channelName, currentBucket);
  });

  const orderedChannels = [...channelBuckets.entries()].sort(
    (left, right) => right[1].revenue - left[1].revenue
  );

  return {
    channelColumn: selection.channelColumn,
    ordersByChannel: orderedChannels.map(([name, bucket]) => ({
      name,
      value: bucket.orders,
    })),
    revenueByChannel: orderedChannels.map(([name, bucket]) => ({
      name,
      value: Number(bucket.revenue.toFixed(2)),
    })),
  };
};

export const analyzeData = (
  data: DataRow[],
  selection: ColumnSelection,
  viewMode: ViewMode
): DashboardAnalysis | null => {
  if (
    !data.length ||
    !selection.categoryColumn ||
    (viewMode === "sales" && !selection.metricColumn) ||
    (viewMode === "profit" &&
      (!selection.revenueColumn || !selection.costColumn))
  ) {
    return null;
  }

  const metricValues = data
    .map((row) => getPrimaryMetricValue(row, selection, viewMode))
    .filter((value): value is number => value !== null);

  if (metricValues.length === 0) {
    return null;
  }

  const total = metricValues.reduce((sum, value) => sum + value, 0);
  const average = total / metricValues.length;
  const min = Math.min(...metricValues);
  const max = Math.max(...metricValues);
  const categoryData = buildCategoryData(data, selection, viewMode);
  const trendData = buildTrendData(data, selection, viewMode);

  return {
    metricColumn: selection.metricColumn,
    categoryColumn: selection.categoryColumn,
    dateColumn: selection.dateColumn,
    aggregationType: selection.aggregationType,
    activeMetricLabel:
      viewMode === "profit" ? "Profit" : selection.metricColumn || "Metric",
    rowCount: data.length,
    validMetricCount: metricValues.length,
    invalidMetricCount: data.length - metricValues.length,
    hasDateData: trendData.some((point) => point.timestamp !== null),
    kpis: {
      total,
      average,
      min,
      max,
    },
    topCategory: categoryData[0]?.name ?? "N/A",
    topCategoryValue: categoryData[0]?.value ?? 0,
    categoryData,
    trendData,
    profitAnalysis: buildProfitAnalysis(data, selection),
    channelAnalysis: buildChannelAnalysis(data, selection),
  };
};
