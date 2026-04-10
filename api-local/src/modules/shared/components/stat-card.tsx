interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-300">
        {title}
      </p>
      <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-200">{description}</p>
    </div>
  );
}
