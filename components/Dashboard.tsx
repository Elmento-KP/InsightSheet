"use client";

import type {
  AIInsightSections,
  AIQuestionAnswer,
  DashboardAnalysis,
  DataRow,
  InsightItem,
  ViewMode,
} from "@/lib/dashboardTypes";
import CategoryCharts from "@/components/charts/CategoryCharts";
import ChannelAnalysisSection from "@/components/charts/ChannelAnalysisSection";
import TrendForecastChart from "@/components/charts/TrendForecastChart";
import AIInsightsPanel from "@/components/ai/AIInsightsPanel";
import RecommendationQuestions from "@/components/ai/RecommendationQuestions";
import DataPreviewTable from "@/components/dashboard/DataPreviewTable";
import InsightList from "@/components/dashboard/InsightList";
import KpiGrid from "@/components/kpi/KpiGrid";

type DashboardProps = {
  data: DataRow[];
  analysis: DashboardAnalysis;
  insights: InsightItem[];
  viewMode: ViewMode;
  aiInsights: AIInsightSections | null;
  aiInsightsLoading: boolean;
  aiInsightsError: string;
  presetQuestions: string[];
  selectedQuestion: string;
  questionAnswer: AIQuestionAnswer | null;
  questionLoading: boolean;
  questionError: string;
  onAskQuestion: (question: string) => void;
};

export default function Dashboard({
  data,
  analysis,
  insights,
  viewMode,
  aiInsights,
  aiInsightsLoading,
  aiInsightsError,
  presetQuestions,
  selectedQuestion,
  questionAnswer,
  questionLoading,
  questionError,
  onAskQuestion,
}: DashboardProps) {
  return (
    <div className="space-y-6">
      <KpiGrid analysis={analysis} viewMode={viewMode} />

      <div className="grid gap-6 xl:grid-cols-2">
        <CategoryCharts analysis={analysis} />
        <TrendForecastChart analysis={analysis} />
      </div>

      {analysis.channelAnalysis ? (
        <ChannelAnalysisSection analysis={analysis.channelAnalysis} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <InsightList insights={insights} />
        <AIInsightsPanel
          insights={aiInsights}
          loading={aiInsightsLoading}
          error={aiInsightsError}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <DataPreviewTable data={data} />
        <RecommendationQuestions
          questions={presetQuestions}
          selectedQuestion={selectedQuestion}
          answer={questionAnswer}
          loading={questionLoading}
          error={questionError}
          onAsk={onAskQuestion}
        />
      </div>
    </div>
  );
}
