'use client';

import { useState } from 'react';
import { UploadCloud } from 'lucide-react';

type UploadBoxProps = {
  onDataParsed: (file: File) => void;
  onUseSampleData: () => void;
};

export default function UploadBox({
  onDataParsed,
  onUseSampleData,
}: UploadBoxProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDataParsed(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`rounded-[32px] border-2 border-dashed p-12 text-center transition-colors ${
        dragActive
          ? 'border-teal-500 bg-teal-50'
          : 'border-slate-300 bg-white/90'
      }`}
      onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
    >
      <UploadCloud className="mx-auto mb-4 h-12 w-12 text-slate-400" />
      <h3 className="text-lg font-semibold text-slate-700">Drag and drop your Excel or CSV file</h3>
      <p className="mt-2 text-sm text-slate-500">Upload one dataset and we will turn it into charts, KPIs, insights, and forecasting.</p>
      <input 
        type="file" 
        accept=".xlsx, .xls, .csv" 
        className="hidden" 
        id="file-upload" 
        onChange={(e) => e.target.files && onDataParsed(e.target.files[0])}
      />
      <label htmlFor="file-upload" className="mt-6 inline-block cursor-pointer rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800">
        Browse Files
      </label>
      <div className="mt-4">
        <button
          type="button"
          onClick={onUseSampleData}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Use Sample Data
        </button>
      </div>
    </div>
  );
}
