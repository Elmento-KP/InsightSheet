'use client';

import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import Dashboard from "@/components/Dashboard";
import UploadBox from "@/components/UploadBox";
import EmptyState from "@/components/dashboard/EmptyState";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import FilterPanel from "@/components/filters/FilterPanel";
import { inferColumnSelection } from "@/lib/columnDetection";
import { analyzeData } from "@/lib/dataAnalyzer";
import type {
  AIInsightSections,
  AIQuestionAnswer,
  ColumnSelection,
  DashboardAnalysis,
  DataRow,
  ViewMode,
} from "@/lib/dashboardTypes";
import { parseFile } from "@/lib/excelParser";
import { generateInsights } from "@/lib/insightGenerator";
import { buildDatasetSummary } from "@/utils/aiSummary";
import { sampleData } from "@/utils/sampleData";

const emptySelection: ColumnSelection = {
  metricColumn: "",
  categoryColumn: "",
  dateColumn: "",
  aggregationType: "sum",
  revenueColumn: "",
  costColumn: "",
  channelColumn: "",
};

const presetQuestions = [
  "What are the top performing products?",
  "Which region has highest growth?",
  "Where should we increase investment?",
];

const DASHBOARD_PREP_MS = 2200;

const delay = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const requestInsights = async (
  analysis: DashboardAnalysis,
  rawData: DataRow[],
  question?: string
) => {
  const response = await fetch("/api/ai-insights", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      datasetSummary: buildDatasetSummary(rawData, analysis),
      question,
    }),
  });

  const result = (await response.json()) as {
    error?: string;
    insights?: AIInsightSections;
    answer?: string;
  };

  if (!response.ok) {
    throw new Error(result.error || "We could not generate AI insights right now.");
  }

  return result;
};

export default function Home() {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selection, setSelection] = useState<ColumnSelection>(emptySelection);
  const [viewMode, setViewMode] = useState<ViewMode>("sales");
  const [isPreparingDashboard, setIsPreparingDashboard] = useState(false);
  const [error, setError] = useState("");
  const [aiInsights, setAiInsights] = useState<AIInsightSections | null>(null);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsError, setAiInsightsError] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(presetQuestions[0]);
  const [questionAnswer, setQuestionAnswer] = useState<AIQuestionAnswer | null>(null);
  const [questionLoading, setQuestionLoading] = useState(false);
  const [questionError, setQuestionError] = useState("");
  const loadSequenceRef = useRef(0);

  const analysis = useMemo(
    () => analyzeData(rawData, selection, viewMode),
    [rawData, selection, viewMode]
  );

  const insights = useMemo(
    () => (analysis ? generateInsights(rawData, analysis) : []),
    [analysis, rawData]
  );

  const resetWorkspace = () => {
    loadSequenceRef.current += 1;
    setRawData([]);
    setColumns([]);
    setSelection(emptySelection);
    setViewMode("sales");
    setError("");
    setAiInsights(null);
    setAiInsightsError("");
    setAiInsightsLoading(false);
    setQuestionAnswer(null);
    setQuestionError("");
    setQuestionLoading(false);
    setIsPreparingDashboard(false);
  };

  const hydrateDataset = async (dataset: DataRow[]) => {
    const requestId = Date.now();
    loadSequenceRef.current = requestId;

    const detectedColumns = dataset.length > 0 ? Object.keys(dataset[0]) : [];
    const inferredSelection = inferColumnSelection(dataset, detectedColumns);

    startTransition(() => {
      setRawData(dataset);
      setColumns(detectedColumns);
      setSelection(inferredSelection);
      setViewMode("sales");
      setError("");
      setAiInsights(null);
      setAiInsightsError("");
      setQuestionAnswer(null);
      setQuestionError("");
      setQuestionLoading(false);
      setSelectedQuestion(presetQuestions[0]);
    });

    setIsPreparingDashboard(true);
    await delay(DASHBOARD_PREP_MS);

    if (loadSequenceRef.current === requestId) {
      setIsPreparingDashboard(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    setError("");

    try {
      const parsedData = await parseFile(file);
      await hydrateDataset(parsedData);
    } catch (err) {
      setIsPreparingDashboard(false);
      setError(
        err instanceof Error
          ? err.message
          : "We could not parse this file. Please try a different workbook."
      );
    }
  };

  const handleUseSampleData = async () => {
    setError("");
    await hydrateDataset(sampleData);
  };

  const handleSelectionChange = <Key extends keyof ColumnSelection>(
    key: Key,
    value: ColumnSelection[Key]
  ) => {
    setQuestionAnswer(null);
    setQuestionError("");
    setSelection((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleAskQuestion = async (question: string) => {
    if (!analysis) {
      return;
    }

    setSelectedQuestion(question);
    setQuestionLoading(true);
    setQuestionError("");

    try {
      const result = await requestInsights(analysis, rawData, question);
      setQuestionAnswer({
        question,
        answer:
          result.answer ||
          "No answer was returned for this question. Please try again.",
      });
    } catch (err) {
      setQuestionError(
        err instanceof Error ? err.message : "Unable to answer this question."
      );
    } finally {
      setQuestionLoading(false);
    }
  };

  useEffect(() => {
    if (!analysis || isPreparingDashboard) {
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setAiInsights(null);
      setAiInsightsLoading(true);
      setAiInsightsError("");

      try {
        const result = await requestInsights(analysis, rawData);
        if (!isMounted) {
          return;
        }

        setAiInsights(result.insights ?? null);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setAiInsights(null);
        setAiInsightsError(
          err instanceof Error
            ? err.message
            : "We could not generate AI insights right now."
        );
      } finally {
        if (isMounted) {
          setAiInsightsLoading(false);
        }
      }
    }, 500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [analysis, rawData, isPreparingDashboard]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef6f8_42%,_#f8fafc_100%)] px-4 py-6 text-slate-900 sm:px-5 sm:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[36px] border border-white/70 bg-slate-950 px-6 py-7 text-white shadow-[0_25px_80px_-45px_rgba(15,23,42,0.8)] lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-teal-300">
              InsightSheet
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Excel to Dashboard, Forecasting, Profit Analysis, and AI Insights
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Upload a spreadsheet, switch columns live, compare channels,
              forecast trends, and turn raw rows into a polished SaaS-style
              analytics workspace.
            </p>
            <p>Note : This project is under-development and is on regular updates. Thanks for Visting</p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {!rawData.length ? (
          <div className="space-y-6">
            <div className="mx-auto max-w-3xl">
              <UploadBox
                onDataParsed={handleFileUpload}
                onUseSampleData={handleUseSampleData}
              />
            </div>
            <EmptyState
              title="No dataset loaded yet"
              description="Upload an Excel workbook or use the built-in sample dataset to explore live filters, AI insights, forecasting, KPI formatting, and profit analysis."
            />
          </div>
        ) : null}

        {rawData.length > 0 ? (
          <div className="space-y-6">
            <FilterPanel
              columns={columns}
              selection={selection}
              viewMode={viewMode}
              onSelectionChange={handleSelectionChange}
              onViewModeChange={(nextMode) => {
                setQuestionAnswer(null);
                setQuestionError("");
                setViewMode(nextMode);
              }}
              onReset={resetWorkspace}
            />

            {isPreparingDashboard ? <DashboardSkeleton /> : null}

            {!isPreparingDashboard && !analysis ? (
              <EmptyState
                title="Dashboard configuration needs one more step"
                description="Select a valid category column and numeric metric. Profit analysis also needs both revenue and cost columns before the charts and KPIs can be generated."
              />
            ) : null}

            {!isPreparingDashboard && analysis ? (
              <Dashboard
                data={rawData}
                analysis={analysis}
                insights={insights}
                viewMode={viewMode}
                aiInsights={aiInsights}
                aiInsightsLoading={aiInsightsLoading}
                aiInsightsError={aiInsightsError}
                presetQuestions={presetQuestions}
                selectedQuestion={selectedQuestion}
                questionAnswer={questionAnswer}
                questionLoading={questionLoading}
                questionError={questionError}
                onAskQuestion={handleAskQuestion}
              />
            ) : null}
          </div>
        ) : null}
      </div>
    </main>
  );
}
