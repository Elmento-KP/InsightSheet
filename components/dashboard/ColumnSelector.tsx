import type { ColumnSelection } from "@/lib/dashboardTypes";

type ColumnSelectorProps = {
  columns: string[];
  selection: ColumnSelection;
  onChange: (field: keyof ColumnSelection, value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

const selectBaseClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

export default function ColumnSelector({
  columns,
  selection,
  onChange,
  onSubmit,
  disabled = false,
}: ColumnSelectorProps) {
  const canGenerate =
    selection.metricColumn.trim() && selection.categoryColumn.trim();

  return (
    <section className="rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-teal-700">
          Configure dashboard
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
          Map your columns before generating analytics
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Choose which column should be treated as the metric, grouping
          category, and optional date axis. This keeps the app flexible for any
          dataset instead of hardcoding field names.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">
          Metric column
          <select
            value={selection.metricColumn}
            onChange={(event) => onChange("metricColumn", event.target.value)}
            className={selectBaseClassName}
          >
            <option value="">Select a numeric column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Category column
          <select
            value={selection.categoryColumn}
            onChange={(event) => onChange("categoryColumn", event.target.value)}
            className={selectBaseClassName}
          >
            <option value="">Select a grouping column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Date column
          <select
            value={selection.dateColumn}
            onChange={(event) => onChange("dateColumn", event.target.value)}
            className={selectBaseClassName}
          >
            <option value="">Optional date column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-50 px-5 py-4">
        <p className="text-sm text-slate-500">
          Required fields: metric and category. Date is optional but improves
          the line chart labels.
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !canGenerate}
          className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {disabled ? "Building dashboard..." : "Generate dashboard"}
        </button>
      </div>
    </section>
  );
}
