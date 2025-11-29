"use client";

type Option = { label: string; value: string };

type FilterControlsProps = {
  periodOptions: Option[];
  segmentOptions: Option[];
  period: string;
  segment: string;
  onPeriodChange: (value: string) => void;
  onSegmentChange: (value: string) => void;
};

export function FilterControls({
  periodOptions,
  segmentOptions,
  period,
  segment,
  onPeriodChange,
  onSegmentChange,
}: FilterControlsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {periodOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onPeriodChange(opt.value)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            period === opt.value
              ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
              : "border-white/15 text-slate-200 hover:border-emerald-400/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
      {segmentOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSegmentChange(opt.value)}
          className={`rounded-full border px-3 py-1 text-xs transition ${
            segment === opt.value
              ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
              : "border-white/15 text-slate-200 hover:border-emerald-400/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
      <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400/50">
        Export
      </button>
    </div>
  );
}
