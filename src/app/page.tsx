"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { StocksPanel } from "@/components/StocksPanel";
import { FilterControls } from "@/components/FilterControls";
import { Toast } from "@/components/Toast";
import { useFilters } from "@/hooks/useFilters";
import { useMockAction } from "@/hooks/useMockAction";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useActionLogger } from "@/hooks/useActionLogger";
import { addRecent } from "@/lib/recents";
const STOCK_SYMBOLS = ["AAPL", "MSFT", "GOOG", "SPY"];
const periodOptions = [
  { label: "7d", value: "7" },
  { label: "30d", value: "30" },
  { label: "90d", value: "90" },
];
const segmentOptions = [
  { label: "All", value: "all" },
  { label: "Mobile", value: "mobile" },
  { label: "Desktop", value: "desktop" },
];

export default function Home() {
  const { period, segment, setPeriod, setSegment } = useFilters({ period: "30", segment: "all" });
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [shareError, setShareError] = useState<string | null>(null);
  const { trigger: triggerMock, ToastSlot: MockToast } = useMockAction();
  const { log } = useActionLogger();
  const {
    dashboard,
    dashLoading,
    dashError,
    stockData,
    stockLoading,
    stockError,
  } = useDashboardData(period, segment, STOCK_SYMBOLS);
  const quickActions = [
    "Slackにスナップショット送信",
    "CSVエクスポート（期間フィルタ反映）",
    "アラート閾値を開く",
    "共有リンクを発行",
  ];
  const insights = [
    "モバイル経由売上が前週比 +8.1%。週末リフトが顕著。",
    "北エリアのセッションが前週比 +12%。在庫とCS体制を確認。",
    "トレンドは00:00-06:00のオフピークで安定。広告入札を朝に最適化。",
    "p95 APIレイテンシ 142ms。SLO内だが余裕は+12ms改善。",
  ];
  const healthChecks = [
    { label: "API p95", value: "142 ms", status: "良好", note: "-12 ms vs 1h" },
    { label: "エラー率", value: "0.14%", status: "安定", note: "-0.03pp" },
    { label: "キュー滞留", value: "< 3s", status: "正常", note: "Webhook queue" },
    { label: "プッシュ配信", value: "98.6%", status: "良好", note: "+0.6pp" },
  ];
  const handleShare = async () => {
    setShareMsg(null);
    setShareError(null);
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: "/" }),
      });
      if (!res.ok) throw new Error(`Failed to share (${res.status})`);
      const data = (await res.json()) as { url: string; expiresAt: string };
      setShareMsg(`共有リンクを発行しました: ${data.url} （有効期限: ${new Date(data.expiresAt).toLocaleString("ja-JP")}）`);
    } catch (err) {
      console.error(err);
      setShareError("共有リンクの発行に失敗しました");
    }
  };

  useEffect(() => {
    addRecent({ label: "ダッシュボード", path: "/", at: Date.now() });
  }, []);

  const isEmpty = useMemo(() => {
    if (!dashboard) return false;
    return (
      dashboard.kpis.length === 0 &&
      dashboard.traffic.length === 0 &&
      dashboard.segments.length === 0 &&
      dashboard.activities.length === 0
    );
  }, [dashboard]);

  const renderKpiSkeleton = () => (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
          <div className="h-4 w-28 rounded bg-white/10" />
          <div className="mt-4 h-6 w-32 rounded bg-white/10" />
          <div className="mt-3 h-16 rounded bg-white/5" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6 md:gap-6 md:px-6 md:py-10">
        {dashError && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {dashError}
          </div>
        )}

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Mobile-first BI
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
                  {dashLoading ? "Loading…" : `Period: ${period}d / ${segment}`}
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">
                モバイルBI コントロールパネル
              </h1>
              <p className="text-sm text-slate-300 md:text-base">
                売上・利用・サービス健全性をモバイルで即時確認（タップしやすいUI）。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setDashLoading(true);
                  fetchDashboardWithParams(period, segment)
                    .then((data) => {
                      setDashboard(data);
                      setDashError(null);
                    })
                    .catch((err) => {
                      console.error(err);
                      setDashError("ダッシュボードデータの再取得に失敗しました");
                    })
                    .finally(() => setDashLoading(false));
                }}
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                {dashLoading ? "同期中…" : "データ同期"}
              </button>
              <button
                onClick={async () => {
                  triggerMock("Slackにスナップショット（モック）を送信しました");
                  await fetch("/api/notify/slack", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ path: "/" }),
                  });
                  log({ action: "slack_snapshot", detail: { path: "/" } });
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                Slack送信
              </button>
              <button
                onClick={async () => {
                  triggerMock("CSVエクスポート（モック）を開始しました");
                  await fetch("/api/export/csv", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ period, segment }),
                  });
                  log({ action: "csv_export", detail: { period, segment } });
                }}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                CSVエクスポート
              </button>
              <button
                onClick={handleShare}
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                共有リンクを発行
              </button>
              <Link
                href="/tools"
                className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                ハブに戻る
              </Link>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterControls
              periodOptions={periodOptions}
              segmentOptions={segmentOptions}
              period={period}
              segment={segment}
              onPeriodChange={setPeriod}
              onSegmentChange={setSegment}
            />
          </div>
        </section>

        {dashLoading && renderKpiSkeleton()}
        {!dashLoading && isEmpty && (
          <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-4 text-sm text-slate-300">
            データがありません。期間やフィルタを確認してください（モックAPI `/api/dashboard?empty=1` で空状態を再現可能）。
          </div>
        )}
        {!dashLoading && dashboard && !isEmpty && (
          <>
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dashboard.kpis.map((kpi) => (
                <article
                  key={kpi.title}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.9)] backdrop-blur"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">{kpi.title}</p>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                      {kpi.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-2">
                    <p className="text-2xl font-semibold text-white md:text-3xl">
                      {kpi.value}
                    </p>
                    <span className="text-xs font-semibold text-emerald-300">
                      {kpi.change}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">Mobile view priority</div>
                  <div className="mt-3 flex items-end gap-1">
                    {kpi.bars.map((height, index) => (
                      <span
                        key={index}
                        className="w-full rounded-full bg-gradient-to-t from-emerald-500/25 to-emerald-300/50"
                        style={{ height: `${Math.max(14, height)}px` }}
                      />
                    ))}
                  </div>
                </article>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur lg:col-span-2">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-slate-300">売上・セッション</p>
                    <h2 className="text-xl font-semibold text-white">モバイル トレンドライン</h2>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-300">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                    ライブ表示
                  </div>
                </div>
                <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-4">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.08),transparent_25%)]" />
                  <div className="relative flex h-40 items-end gap-1">
                    {dashboard.traffic.map((value, index) => (
                      <div
                        key={index}
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/30 via-emerald-400/40 to-white"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative mt-4 flex justify-between text-[11px] text-slate-400">
                    <span>00:00</span>
                    <span>06:00</span>
                    <span>12:00</span>
                    <span>18:00</span>
                    <span>24:00</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-200">
                  <span className="rounded-full bg-white/10 px-3 py-1">週末リフト増</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">タップ深度上昇</span>
                  <span className="rounded-full bg-white/10 px-3 py-1">北エリアのスパイク</span>
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-300">セグメント</p>
                    <h2 className="text-xl font-semibold text-white">パフォーマンス構成</h2>
                  </div>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">
                    モバイル注力
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboard.segments.map((segment) => (
                    <div key={segment.name} className="space-y-2 rounded-xl border border-white/5 bg-white/5 p-3">
                      <div className="flex items-center justify-between text-sm text-white">
                        <span>{segment.name}</span>
                        <span className="text-emerald-200">{segment.lift}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500/60 to-emerald-400/50"
                            style={{ width: `${segment.share}%` }}
                          />
                        </div>
                        <span>{segment.share}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {dashboard.activities.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"
                >
                  <p className="text-sm text-slate-300">{item.title}</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.detail}</p>
                  <p className="text-xs text-emerald-200">{item.change}</p>
                </article>
              ))}
            </section>

            <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">クイックアクション</h3>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">共有・通知</span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <button
                      key={action}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">インサイト</h3>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">自動サマリ</span>
                </div>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {insights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 rounded-xl border border-white/5 bg-slate-900/50 px-3 py-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </section>

            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {healthChecks.map((hc) => (
                <article key={hc.label} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">{hc.label}</p>
                    <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">
                      {hc.status}
                    </span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-white">{hc.value}</p>
                  <p className="text-xs text-emerald-200">{hc.note}</p>
                </article>
              ))}
            </section>
          </>
        )}

        {stockError && (
          <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {stockError}
          </div>
        )}
        {stockLoading && (
          <div className="text-xs text-slate-400">
            株価データを取得中…
          </div>
        )}
        <StocksPanel symbols={STOCK_SYMBOLS} initialData={stockData} defaultRange={90} />
      </main>
      {shareMsg && <Toast message={shareMsg} type="success" onClose={() => setShareMsg(null)} />}
      {shareError && <Toast message={shareError} type="error" onClose={() => setShareError(null)} />}
      {MockToast}
    </div>
  );
}
