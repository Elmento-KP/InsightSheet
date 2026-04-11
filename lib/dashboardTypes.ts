export type DataCell = string | number | null;
export type DataRow = Record<string, DataCell>;

export type AggregationType = "sum" | "average" | "count" | "max" | "min";
export type ViewMode = "sales" | "profit";

export type ColumnSelection = {
  metricColumn: string;
  categoryColumn: string;
  dateColumn: string;
  aggregationType: AggregationType;
  revenueColumn: string;
  costColumn: string;
  channelColumn: string;
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
  timestamp: number | null;
};

export type KpiMetrics = {
  total: number;
  average: number;
  min: number;
  max: number;
};

export type ProfitAnalysis = {
  revenue: number;
  cost: number;
  profit: number;
  marginPercent: number | null;
  status: "profit" | "loss" | "breakeven";
  isBreakEven: boolean;
};

export type ChannelAnalysis = {
  channelColumn: string;
  ordersByChannel: ChartDatum[];
  revenueByChannel: ChartDatum[];
};

export type DashboardAnalysis = {
  metricColumn: string;
  categoryColumn: string;
  dateColumn: string;
  aggregationType: AggregationType;
  activeMetricLabel: string;
  rowCount: number;
  validMetricCount: number;
  invalidMetricCount: number;
  hasDateData: boolean;
  kpis: KpiMetrics;
  topCategory: string;
  topCategoryValue: number;
  categoryData: ChartDatum[];
  trendData: TrendDatum[];
  profitAnalysis: ProfitAnalysis | null;
  channelAnalysis: ChannelAnalysis | null;
};

export type InsightItem = {
  type: "summary" | "trend" | "category" | "quality" | "profit" | "channel";
  text: string;
};

export type AIInsightSections = {
  summary: string;
  trends: string[];
  keyObservations: string[];
  recommendations: string[];
};

export type AIQuestionAnswer = {
  question: string;
  answer: string;
};
