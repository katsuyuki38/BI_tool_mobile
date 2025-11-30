"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FilterControls } from "@/components/FilterControls";
import { useAdhocData } from "@/hooks/useAdhocData";
import { useFilters } from "@/hooks/useFilters";
import { useActionLogger } from "@/hooks/useActionLogger";
import { addRecent } from "@/lib/recents";

const periodOptions = [
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];

const dimensionOptions = [
  { label: "チャネル", value: "channel" },
  { label: "デバイス", value: "device" },
  { label: "エリア", value: "region" },
];

export default function AdhocPage() {
  const { period, segment, setPeriod, setSegment } = useFilters({ period: "30", segment: "all" });
  const [dimension, setDimension] = useState("channel");
  const { data, error, loading } = useAdhocData(period, dimension);
  const { log } = useActionLogger();
  const isEmpty = useMemo(() => data && data.rows.length === 0, [data]);
  useEffect(() => {
    addRecent({ label: "アドホック分析", path: "/adhoc", at: Date.now() });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-emerald-200">Ad-hoc Beta</p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">即席分析（モック）</h1>
            <p className="text-sm text-slate-300">期間とディメンションを選択し、モバイル向けの簡易集計を表示します。</p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
          >
            ハブに戻る
          </Link>
        </header>

        {error && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h2 className="text-sm font-semibold text-white">期間プリセット</h2>
          <FilterControls
            periodOptions={periodOptions}
            segmentOptions={[
              { label: "All", value: "all" },
              { label: "Mobile", value: "mobile" },
              { label: "Desktop", value: "desktop" },
            ]}
            period={period}
            segment={segment}
            onPeriodChange={(value) => {
              setPeriod(value);
              log({ action: "adhoc_period_change", detail: { value } });
            }}
            onSegmentChange={(value) => {
              setSegment(value);
              log({ action: "adhoc_segment_change", detail: { value } });
            }}
          />

          <h3 className="mt-4 text-sm font-semibold text-white">ディメンション</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {dimensionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setDimension(opt.value);
                  log({ action: "adhoc_dimension_change", detail: { value: opt.value } });
                }}
                className={`rounded-full border px-3 py-1 transition ${
                  dimension === opt.value
                    ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                    : "border-white/15 text-slate-200 hover:border-emerald-400/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">結果プレビュー</h3>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
              {loading ? "Loading" : "Mock"}
            </span>
          </div>

          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
              ローディング中…
            </div>
          )}

          {!loading && isEmpty && (
            <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-4 text-sm text-slate-300">
              データがありません。期間やディメンションを変更してください（`/api/adhoc?empty=1` で空状態再現可）。
            </div>
          )}

          {!loading && data && !isEmpty && (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                {data.summary.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                    <p className="text-xs text-emerald-200">{item.change}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <div className="grid grid-cols-4 bg-white/5 px-4 py-3 text-xs font-semibold text-slate-200">
                  <span>区分</span>
                  <span className="text-right">セッション</span>
                  <span className="text-right">売上 (M JPY)</span>
                  <span className="text-right">CVR</span>
                </div>
                <div className="divide-y divide-white/5 bg-slate-900/40">
                  {data.rows.map((row) => (
                    <div key={row.label} className="grid grid-cols-4 px-4 py-3 text-sm text-slate-200">
                      <span>{row.label}</span>
                      <span className="text-right">{row.sessions.toLocaleString()}</span>
                      <span className="text-right">{row.revenue.toFixed(1)}</span>
                      <span className="text-right">{row.cvr.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        <section className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4 text-xs text-slate-400">
          本画面はモックです。SWR/React Query を導入し、フィルタ状態を共有する予定。今は単純なフェッチのみ。
        </section>
      </main>
    </div>
  );
}
