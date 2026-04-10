import { PropsWithChildren } from "react";

interface SectionCardProps extends PropsWithChildren {
  className?: string;
}

export function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[2rem] border border-white/50 bg-[var(--surface)] p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}
