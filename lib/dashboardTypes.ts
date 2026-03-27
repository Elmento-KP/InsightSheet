export type DataRow = Record<string, string | number | null>;

export type ColumnSelection = {
  metricColumn: string;
  categoryColumn: string;
  dateColumn: string;
};

export type ChartDatum = {
  name: string;
  value: number;
};

export type TrendDatum = {
  label: string;
  actual: number | null;
  forecast: number | null;
  isForecast: boolean;
};

export type KpiMetrics = {
  total: number;
  average: number;
  min: number;
  max: number;
};

export type DashboardAnalysis = {
  metricColumn: string;
  categoryColumn: string;
  dateColumn: string;
  rowCount: number;
  validMetricCount: number;
  kpis: KpiMetrics;
  topCategory: string;
  topCategoryValue: number;
  categoryData: ChartDatum[];
  trendData: TrendDatum[];
};

export type InsightItem = {
  type: "summary" | "trend" | "category" | "quality";
  text: string;
};
