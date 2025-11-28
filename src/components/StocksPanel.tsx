"use client";

import { useState, useTransition } from "react";
import type { StockSummary } from "@/types/stocks";

type Props = {
  symbols: string[];
  initialData: Record<string, StockSummary>;
  defaultRange?: number;
};

const ranges = [30, 90, 180];

async function fetchSummary(symbol: string, days: number): Promise<StockSummary> {
  const res = await fetch(`/api/stocks?symbol=${symbol}&days=${days}`, {
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Failed to load ${symbol} (${res.status})`);
  }
  return res.json();
}

export function StocksPanel({ symbols, initialData, defaultRange = 90 }: Props) {
  const [data, setData] = useState<Record<string, StockSummary>>(initialData);
  const [range, setRange] = useState(defaultRange);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleRangeChange = (nextRange: number) => {
    if (nextRange === range) return;
    startTransition(async () => {
      try {
        setError(null);
        const entries = await Promise.all(
          symbols.map(async (symbol) => [symbol, await fetchSummary(symbol, nextRange)] as const),
        );
        setData(Object.fromEntries(entries) as Record<string, StockSummary>);
        setRange(nextRange);
      } catch (err) {
        console.error(err);
        setError("データ取得に失敗しました");
      }
    });
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-300">Equities watch</p>
          <h2 className="text-xl font-semibold text-white">US stocks (last {range}d)</h2>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => handleRangeChange(r)}
              disabled={isPending}
              className={`rounded-full px-3 py-1 font-semibold transition ${
                r === range
                  ? "bg-white text-slate-900"
                  : "border border-white/20 text-slate-200 hover:border-emerald-400/50 hover:text-emerald-100"
              } ${isPending ? "opacity-70" : ""}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mt-3 rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">{error}</div>}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {symbols.map((symbol) => {
          const summary = data[symbol];
          const prices = summary?.series ?? [];
          const closes = prices.map((p) => p.close);
          const min = closes.length ? Math.min(...closes) : 0;
          const max = closes.length ? Math.max(...closes) : 1;
          const rangeDiff = max - min || 1;
          const dayChange = summary?.changePct ?? 0;
          const weekChange = summary?.weeklyChangePct ?? 0;
          const loading = isPending && !summary;

          return (
            <article
              key={symbol}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-lg font-semibold">{symbol}</span>
                  <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                    {dayChange >= 0 ? "+" : ""}
                    {dayChange.toFixed(2)}% d/d
                  </span>
                </div>
                <div className="text-right text-sm text-slate-300">
                  <div className="text-white">
                    {summary ? `$${summary.latestClose.toFixed(2)}` : "—"}
                  </div>
                  <div className={`text-xs ${weekChange >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                    {weekChange >= 0 ? "+" : ""}
                    {weekChange.toFixed(2)}% w/w
                  </div>
                </div>
              </div>
              <div className="flex h-24 items-end gap-[2px]">
                {prices.map((p) => {
                  const normalized = ((p.close - min) / rangeDiff) * 100;
                  return (
                    <span
                      key={p.date}
                      className="flex-1 rounded-full bg-gradient-to-t from-emerald-500/25 to-white/80"
                      style={{ height: `${Math.max(10, normalized)}%` }}
                      title={`${p.date}: $${p.close.toFixed(2)}`}
                    />
                  );
                })}
                {!prices.length && <div className="text-xs text-slate-400">No data</div>}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>{prices[0]?.date ?? "—"}</span>
                <span>{prices[prices.length - 1]?.date ?? "—"}</span>
              </div>
              {loading && <div className="text-[11px] text-slate-400">Updating…</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
