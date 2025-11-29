"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type AdhocRow = { label: string; sessions: number; revenue: number; cvr: number };
type AdhocResponse = {
  period: string;
  dimension: string;
  summary: Array<{ label: string; value: string; change: string }>;
  rows: AdhocRow[];
};

const periodOptions = [
  { label: "7日間", value: "7" },
  { label: "30日間", value: "30" },
  { label: "90日間", value: "90" },
];

const dimensionOptions = [
  { label: "チャネル", value: "channel" },
  { label: "デバイス", value: "device" },
  { label: "エリア", value: "region" },
];

const fetchAdhoc = async (period: string, dimension: string): Promise<AdhocResponse> => {
  const query = new URLSearchParams({ period, dimension }).toString();
  const res = await fetch(`/api/adhoc?${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load adhoc data (${res.status})`);
  return res.json();
};

export default function AdhocPage() {
  const [period, setPeriod] = useState("30");
  const [dimension, setDimension] = useState("channel");
  const [data, setData] = useState<AdhocResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    fetchAdhoc(period, dimension)
      .then((res) => {
        if (!active) return;
        setData(res);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        if (!active) return;
        setError("アドホックデータの取得に失敗しました");
        setData(null);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [period, dimension]);

  const isEmpty = useMemo(() => data && data.rows.length === 0, [data]);

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
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            {periodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={`rounded-full border px-3 py-1 transition ${
                  period === opt.value
                    ? "border-emerald-300 bg-emerald-500/15 text-emerald-100"
                    : "border-white/15 text-slate-200 hover:border-emerald-400/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <h3 className="mt-4 text-sm font-semibold text-white">ディメンション</h3>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            {dimensionOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDimension(opt.value)}
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
