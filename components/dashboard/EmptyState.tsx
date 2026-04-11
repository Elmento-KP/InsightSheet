type EmptyStateProps = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-6 py-10 text-center shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] backdrop-blur">
      <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
