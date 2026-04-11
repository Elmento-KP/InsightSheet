const SkeletonBlock = ({ className }: { className: string }) => (
  <div className={`animate-pulse rounded-3xl bg-slate-200/80 ${className}`} />
);

export default function DashboardSkeleton() {
  return (
    <section className="space-y-6 rounded-[32px] border border-white/70 bg-white/75 p-6 shadow-[0_25px_80px_-45px_rgba(15,23,42,0.4)] backdrop-blur transition-opacity duration-300">
      <div className="rounded-[28px] border border-slate-200 bg-slate-50/90 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-teal-700">
          Preparing dashboard
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Your dashboard is getting ready...
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          We are processing the spreadsheet, applying your selections, and
          shaping charts, KPIs, and AI-ready summaries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)]"
          >
            <SkeletonBlock className="mb-4 h-4 w-24" />
            <SkeletonBlock className="h-9 w-28" />
            <SkeletonBlock className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SkeletonBlock className="h-80 w-full" />
        <SkeletonBlock className="h-80 w-full" />
        <SkeletonBlock className="h-96 w-full xl:col-span-2" />
      </div>
    </section>
  );
}
