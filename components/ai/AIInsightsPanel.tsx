import type { AIInsightSections } from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

type AIInsightsPanelProps = {
  insights: AIInsightSections | null;
  loading: boolean;
  error: string;
};

const sections: Array<keyof AIInsightSections> = [
  "summary",
  "trends",
  "keyObservations",
  "recommendations",
];

export default function AIInsightsPanel({
  insights,
  loading,
  error,
}: AIInsightsPanelProps) {
  return (
    <SectionCard
      title="AI Insights"
      subtitle="Gemini-generated summary, trend readout, observations, and recommendations."
    >
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-slate-100"
            />
          ))}
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          {error}
        </div>
      ) : null}

      {!loading && !error && !insights ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-sm text-slate-500">
          AI insights will appear here once the dashboard summary is ready.
        </div>
      ) : null}

      {!loading && !error && insights ? (
        <div className="space-y-4">
          {sections.map((sectionKey) => (
            <div
              key={sectionKey}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
            >
              <h4 className="text-sm font-semibold capitalize text-slate-900">
                {sectionKey === "keyObservations"
                  ? "Key observations"
                  : sectionKey}
              </h4>
              {Array.isArray(insights[sectionKey]) ? (
                <div className="mt-3 space-y-2">
                  {(insights[sectionKey] as string[]).map((item, index) => (
                    <p key={index} className="text-sm leading-6 text-slate-600">
                      {item}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {insights[sectionKey] as string}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </SectionCard>
  );
}
