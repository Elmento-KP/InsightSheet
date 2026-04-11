import {
  Activity,
  BadgeIndianRupee,
  ChartNoAxesCombined,
  CircleOff,
  ScanSearch,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { DashboardAnalysis, ViewMode } from "@/lib/dashboardTypes";
import { formatSmartNumber } from "@/utils/format";
import KpiCard from "@/components/kpi/KpiCard";

type KpiGridProps = {
  analysis: DashboardAnalysis;
  viewMode: ViewMode;
};

export default function KpiGrid({ analysis, viewMode }: KpiGridProps) {
  const cards = [
    {
      key: "total",
      title: "Total",
      value: formatSmartNumber(analysis.kpis.total),
      subtitle: analysis.activeMetricLabel,
      icon: BadgeIndianRupee,
      accent: "from-sky-500 to-cyan-400",
    },
    {
      key: "average",
      title: "Average",
      value: formatSmartNumber(analysis.kpis.average),
      subtitle: analysis.activeMetricLabel,
      icon: Activity,
      accent: "from-emerald-500 to-lime-400",
    },
    {
      key: "max",
      title: "Max",
      value: formatSmartNumber(analysis.kpis.max),
      subtitle: analysis.activeMetricLabel,
      icon: ChartNoAxesCombined,
      accent: "from-amber-500 to-orange-400",
    },
    {
      key: "min",
      title: "Min",
      value: formatSmartNumber(analysis.kpis.min),
      subtitle: analysis.activeMetricLabel,
      icon: ScanSearch,
      accent: "from-fuchsia-500 to-pink-400",
    },
  ];

  const profitCards =
    viewMode === "profit" && analysis.profitAnalysis
      ? [
          {
            key: "revenue",
            title: "Revenue",
            value: formatSmartNumber(analysis.profitAnalysis.revenue),
            subtitle: "Total revenue",
            icon: Wallet,
            accent: "from-indigo-500 to-sky-400",
          },
          {
            key: "profit",
            title: "Profit / Loss",
            value: formatSmartNumber(analysis.profitAnalysis.profit),
            subtitle:
              analysis.profitAnalysis.status === "profit"
                ? "Operating profit"
                : analysis.profitAnalysis.status === "loss"
                  ? "Operating loss"
                  : "Break-even",
            icon:
              analysis.profitAnalysis.status === "profit"
                ? TrendingUp
                : analysis.profitAnalysis.status === "loss"
                  ? TrendingDown
                  : CircleOff,
            accent:
              analysis.profitAnalysis.status === "profit"
                ? "from-emerald-500 to-teal-400"
                : analysis.profitAnalysis.status === "loss"
                  ? "from-rose-500 to-orange-400"
                  : "from-slate-500 to-slate-300",
          },
          {
            key: "breakeven",
            title: "Break-even",
            value: analysis.profitAnalysis.isBreakEven ? "Above" : "Below",
            subtitle: analysis.profitAnalysis.isBreakEven
              ? "Revenue covers cost"
              : "Revenue below cost",
            icon: analysis.profitAnalysis.isBreakEven ? TrendingUp : TrendingDown,
            accent: "from-violet-500 to-fuchsia-400",
          },
        ]
      : [];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[...cards, ...profitCards].map((card) => (
        <KpiCard key={card.key} {...card} />
      ))}
    </div>
  );
}
