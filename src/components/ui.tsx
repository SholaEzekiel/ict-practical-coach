import { clsx } from "clsx";
import type { ReactNode } from "react";

export function Section({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={clsx("mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8", className)}>{children}</section>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("rounded-lg border border-line bg-white p-5 shadow-soft", className)}>{children}</div>;
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={clsx("inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700", className)}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-slate-100" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full rounded-full bg-leaf" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
