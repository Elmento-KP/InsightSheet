import {
  Activity,
  BadgeIndianRupee,
  ChartNoAxesCombined,
  ScanSearch,
} from "lucide-react";
import type { DashboardAnalysis } from "@/lib/dashboardTypes";

const formatValue = (value: number) =>
  value.toLocaleString(undefined, { maximumFractionDigits: 2 });

type KpiGridProps = {
  analysis: DashboardAnalysis;
};

const cards = [
  {
    key: "total",
    title: "Total",
    icon: BadgeIndianRupee,
    color: "from-sky-500 to-cyan-400",
  },
  {
    key: "average",
    title: "Average",
    icon: Activity,
    color: "from-emerald-500 to-lime-400",
  },
  {
    key: "max",
    title: "Max",
    icon: ChartNoAxesCombined,
    color: "from-amber-500 to-orange-400",
  },
  {
    key: "min",
    title: "Min",
    icon: ScanSearch,
    color: "from-fuchsia-500 to-pink-400",
  },
] as const;

export default function KpiGrid({ analysis }: KpiGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ key, title, icon: Icon, color }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)]"
        >
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${color}`}
          />
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">{title}</span>
            <span className="rounded-2xl bg-slate-100 p-2 text-slate-600">
              <Icon className="h-4 w-4" />
            </span>
          </div>
          <p className="text-3xl font-semibold tracking-tight text-slate-950">
            {formatValue(analysis.kpis[key])}
          </p>
          <p className="mt-2 text-sm text-slate-500">{analysis.metricColumn}</p>
        </div>
      ))}
    </div>
  );
}
