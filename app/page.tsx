'use client';

import { startTransition, useState } from "react";
import Dashboard from "@/components/Dashboard";
import UploadBox from "@/components/UploadBox";
import ColumnSelector from "@/components/dashboard/ColumnSelector";
import { inferColumnSelection } from "@/lib/columnDetection";
import { analyzeData } from "@/lib/dataAnalyzer";
import type {
  ColumnSelection,
  DashboardAnalysis,
  DataRow,
  InsightItem,
  TrendDatum,
} from "@/lib/dashboardTypes";
import { parseFile } from "@/lib/excelParser";
import { generateForecast } from "@/lib/forecastEngine";
import { generateInsights } from "@/lib/insightGenerator";

const emptySelection: ColumnSelection = {
  metricColumn: "",
  categoryColumn: "",
  dateColumn: "",
};

export default function Home() {
  const [rawData, setRawData] = useState<DataRow[]>([]);
  const [analysis, setAnalysis] = useState<DashboardAnalysis | null>(null);
  const [forecast, setForecast] = useState<TrendDatum[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selection, setSelection] = useState<ColumnSelection>(emptySelection);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetWorkspace = () => {
    setAnalysis(null);
    setRawData([]);
    setForecast([]);
    setInsights([]);
    setColumns([]);
    setSelection(emptySelection);
    setError("");
  };

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError("");

    try {
      const parsedData = await parseFile(file);
      if (!parsedData.length) {
        throw new Error("The uploaded file is empty or contains only blank rows.");
      }

      const detectedColumns = Object.keys(parsedData[0]);
      const inferredSelection = inferColumnSelection(parsedData, detectedColumns);

      startTransition(() => {
        setRawData(parsedData);
        setColumns(detectedColumns);
        setSelection(inferredSelection);
        setAnalysis(null);
        setForecast([]);
        setInsights([]);
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "We could not parse this file. Please try a different workbook."
      );
    } finally {
      setLoading(false);
    }
  };

  const generateDashboard = () => {
    if (!rawData.length) {
      return;
    }

    const analyzedData = analyzeData(rawData, selection);

    if (!analyzedData) {
      setError(
        "We could not build the dashboard. Please make sure the metric column contains numeric values and the category column is selected."
      );
      return;
    }

    const actualSeries = analyzedData.trendData
      .map((item) => item.actual)
      .filter((value): value is number => value !== null);
    const labels = analyzedData.trendData.map((item) => item.label);
    const forecastData = generateForecast(actualSeries, labels);
    const insightData = generateInsights(rawData, analyzedData);

    startTransition(() => {
      setError("");
      setAnalysis(analyzedData);
      setForecast(forecastData);
      setInsights(insightData);
    });
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_28%),linear-gradient(180deg,_#f8fafc_0%,_#eef6f8_42%,_#f8fafc_100%)] px-5 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[36px] border border-white/70 bg-slate-950 px-8 py-8 text-white shadow-[0_25px_80px_-45px_rgba(15,23,42,0.8)] lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-teal-300">
              InsightSheet
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight">
              Excel to Dashboard, Insights, and Forecasting in Minutes
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
              Upload a spreadsheet, map your columns, and generate a
              portfolio-grade analytics surface with KPIs, Charts, Preview Data,
              and basic predictive signals.
            </p>
            <p>Note : This project is under-development and is on regular updates. Thanks for Visting </p>
          </div>

          {analysis ? (
            <button
              onClick={resetWorkspace}
              className="rounded-2xl border border-white/20 px-4 py-3 text-sm text-white transition hover:bg-white/10"
            >
              Upload New File
            </button>
          ) : null}
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-teal-600" />
          </div>
        ) : null}

        {!rawData.length && !loading ? (
          <div className="mx-auto mt-20 max-w-3xl">
            <UploadBox onDataParsed={handleFileUpload} />
          </div>
        ) : null}

        {error ? (
          <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        {rawData.length > 0 && !analysis ? (
          <ColumnSelector
            columns={columns}
            selection={selection}
            onChange={(field, value) =>
              setSelection((current) => ({ ...current, [field]: value }))
            }
            onSubmit={generateDashboard}
          />
        ) : null}

        {analysis ? (
          <Dashboard
            data={rawData}
            analysis={analysis}
            forecast={forecast}
            insights={insights}
          />
        ) : null}
      </div>
    </main>
  );
}
