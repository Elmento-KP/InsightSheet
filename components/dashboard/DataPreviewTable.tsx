import type { DataRow } from "@/lib/dashboardTypes";
import SectionCard from "@/components/dashboard/SectionCard";

type DataPreviewTableProps = {
  data: DataRow[];
};

export default function DataPreviewTable({ data }: DataPreviewTableProps) {
  const previewRows = data.slice(0, 8);
  const columns = previewRows.length > 0 ? Object.keys(previewRows[0]) : [];

  return (
    <SectionCard
      title="Data Preview"
      subtitle={`Showing ${previewRows.length} of ${data.length} uploaded rows`}
    >
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-slate-200 bg-slate-50 px-4 py-3 font-medium text-slate-600"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, index) => (
              <tr key={index} className="odd:bg-white even:bg-slate-50/60">
                {columns.map((column) => (
                  <td
                    key={`${index}-${column}`}
                    className="border-b border-slate-100 px-4 py-3 text-slate-600"
                  >
                    {row[column] === null || row[column] === ""
                      ? "-"
                      : String(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
