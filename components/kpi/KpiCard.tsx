import type { LucideIcon } from "lucide-react";

type KpiCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
};

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: KpiCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_16px_45px_-30px_rgba(15,23,42,0.45)]">
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        <span className="rounded-2xl bg-slate-100 p-2 text-slate-600">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="text-3xl font-semibold tracking-tight text-slate-950">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
