import type { ReactNode } from "react";

export function officeText(locale: string, es: string, ar: string) {
  return locale === "ar" ? ar : es;
}

export function OfficePageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
          {eyebrow}
        </p>
        <h2 className="m-0 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-lg leading-relaxed text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function OfficeCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ${className}`}>
      {children}
    </div>
  );
}

export function StatusBadge({ children, tone = "slate" }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    green: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    red: "bg-red-50 text-red-800 ring-red-100",
    orange: "bg-orange-50 text-orange-800 ring-orange-100",
    blue: "bg-blue-50 text-blue-800 ring-blue-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${tones[tone] ?? tones.slate}`}>
      {children}
    </span>
  );
}

export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  return (
    <div className={`h-2.5 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}>
      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
