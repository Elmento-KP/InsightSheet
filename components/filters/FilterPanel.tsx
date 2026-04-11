import type {
  ColumnSelection,
  ViewMode,
} from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

type FilterPanelProps = {
  columns: string[];
  selection: ColumnSelection;
  viewMode: ViewMode;
  onSelectionChange: <Key extends keyof ColumnSelection>(
    key: Key,
    value: ColumnSelection[Key]
  ) => void;
  onViewModeChange: (value: ViewMode) => void;
  onReset: () => void;
};

const selectClassName =
  "mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10";

const aggregationOptions: ColumnSelection["aggregationType"][] = [
  "sum",
  "average",
  "count",
  "max",
  "min",
];

export default function FilterPanel({
  columns,
  selection,
  viewMode,
  onSelectionChange,
  onViewModeChange,
  onReset,
}: FilterPanelProps) {
  return (
    <SectionCard
      title="Live Dashboard Controls"
      subtitle="Change columns, aggregation, and analysis view instantly without re-uploading the file."
    >
      <div className="grid gap-4 lg:grid-cols-5">
        <label className="text-sm font-medium text-slate-700">
          Category column
          <select
            value={selection.categoryColumn}
            onChange={(event) =>
              onSelectionChange("categoryColumn", event.target.value)
            }
            className={selectClassName}
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
          Metric column
          <select
            value={selection.metricColumn}
            onChange={(event) =>
              onSelectionChange("metricColumn", event.target.value)
            }
            className={selectClassName}
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
          Date column
          <select
            value={selection.dateColumn}
            onChange={(event) => onSelectionChange("dateColumn", event.target.value)}
            className={selectClassName}
          >
            <option value="">Optional date column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Aggregation
          <select
            value={selection.aggregationType}
            onChange={(event) =>
              onSelectionChange("aggregationType", event.target.value as ColumnSelection["aggregationType"])
            }
            className={selectClassName}
          >
            {aggregationOptions.map((option) => (
              <option key={option} value={option}>
                {option[0]?.toUpperCase()}
                {option.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Channel column
          <select
            value={selection.channelColumn}
            onChange={(event) =>
              onSelectionChange("channelColumn", event.target.value)
            }
            className={selectClassName}
          >
            <option value="">Optional channel column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <label className="text-sm font-medium text-slate-700">
          Revenue column
          <select
            value={selection.revenueColumn}
            onChange={(event) =>
              onSelectionChange("revenueColumn", event.target.value)
            }
            className={selectClassName}
          >
            <option value="">Optional revenue column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-medium text-slate-700">
          Cost column
          <select
            value={selection.costColumn}
            onChange={(event) => onSelectionChange("costColumn", event.target.value)}
            className={selectClassName}
          >
            <option value="">Optional cost column</option>
            {columns.map((column) => (
              <option key={column} value={column}>
                {column}
              </option>
            ))}
          </select>
        </label>

        <div className="lg:col-span-2">
          <p className="text-sm font-medium text-slate-700">Analysis view</p>
          <div className="mt-2 inline-flex rounded-2xl bg-slate-100 p-1">
            {(["sales", "profit"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${
                  viewMode === mode
                    ? "bg-slate-950 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-950"
                }`}
              >
                {mode === "sales" ? "Sales View" : "Profit Analysis View"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-50 px-5 py-4">
        <p className="max-w-3xl text-sm text-slate-500">
          Profit analysis uses revenue and cost columns. Channel charts appear
          automatically when a channel column is selected.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Upload New File
        </button>
      </div>
    </SectionCard>
  );
}
