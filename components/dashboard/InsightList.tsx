import {
  Lightbulb,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import type { InsightItem } from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

type InsightListProps = {
  insights: InsightItem[];
};

const iconMap = {
  summary: Lightbulb,
  trend: TrendingUp,
  category: TrendingUp,
  quality: ShieldAlert,
  profit: Wallet,
  channel: TrendingDown,
};

export default function InsightList({ insights }: InsightListProps) {
  return (
    <SectionCard
      title="Insights"
      subtitle="Auto-generated takeaways from the uploaded dataset"
    >
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = iconMap[insight.type];

          return (
            <div
              key={`${insight.type}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Icon className="h-4 w-4" />
                <span className="capitalize">{insight.type}</span>
              </div>
              <p className="text-sm leading-6 text-slate-600">{insight.text}</p>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}
