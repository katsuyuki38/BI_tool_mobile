import { StocksPanel } from "@/components/StocksPanel";
import { loadMultipleSummaries } from "@/lib/stocks";

export default async function Home() {
  const stockSymbols = ["AAPL", "MSFT", "GOOG", "SPY"];
  const stockData = await loadMultipleSummaries(stockSymbols, 90);

  const kpis = [
    {
      title: "Total Revenue",
      value: "JPY 12.8M",
      change: "+8.1% vs 7d",
      status: "Live",
      bars: [32, 54, 48, 62, 58, 66, 72, 64],
    },
    {
      title: "Active Users",
      value: "28.4K",
      change: "+2.4% vs 7d",
      status: "Realtime",
      bars: [18, 26, 22, 30, 28, 34, 36, 40],
    },
    {
      title: "Conversion",
      value: "3.9%",
      change: "+0.3pp",
      status: "Steady",
      bars: [22, 20, 24, 26, 28, 30, 32, 31],
    },
    {
      title: "Retention D30",
      value: "71%",
      change: "+1.1pp",
      status: "Healthy",
      bars: [60, 62, 63, 64, 65, 67, 68, 71],
    },
  ];

  const traffic = [38, 44, 40, 52, 58, 54, 63, 72, 64, 70, 75, 78];

  const segments = [
    { name: "Mobile checkout", share: 64, lift: "+6.2%" },
    { name: "Organic search", share: 48, lift: "+3.1%" },
    { name: "Referral partners", share: 36, lift: "+4.8%" },
    { name: "In-app prompts", share: 28, lift: "+2.4%" },
  ];

  const activities = [
    { title: "Orders", value: "2.4K", detail: "today", change: "+5.4%" },
    { title: "Avg ticket", value: "JPY 4.7K", detail: "per order", change: "+1.9%" },
    { title: "Support CSAT", value: "4.6 / 5", detail: "mobile chats", change: "stable" },
    { title: "Latency", value: "142 ms", detail: "p95 API", change: "-12 ms" },
  ];

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-6 md:gap-6 md:px-6 md:py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Mobile-first BI
                </span>
                <span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200">
                  Updated 2 min ago
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">
                Realtime Control Panel
              </h1>
              <p className="text-sm text-slate-300 md:text-base">
                Tap-friendly view for monitoring revenue, usage, and service health.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-xl">
                Sync data
              </button>
              <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100">
                Share link
              </button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400/50">
              Today
            </button>
            <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400/50">
              7 days
            </button>
            <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400/50">
              Mobile only
            </button>
            <button className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition hover:border-emerald-400/50">
              Export
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => (
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
                <p className="text-sm text-slate-300">Revenue & sessions</p>
                <h2 className="text-xl font-semibold text-white">Mobile trendline</h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                Live data stream
              </div>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(16,185,129,0.08),transparent_25%)]" />
              <div className="relative flex h-40 items-end gap-1">
                {traffic.map((value, index) => (
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
              <span className="rounded-full bg-white/10 px-3 py-1">Higher weekend lift</span>
              <span className="rounded-full bg-white/10 px-3 py-1">Tap depth rising</span>
              <span className="rounded-full bg-white/10 px-3 py-1">North region spike</span>
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-300">Segments</p>
                <h2 className="text-xl font-semibold text-white">Performance mix</h2>
              </div>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">
                Mobile focus
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {segments.map((segment) => (
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

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Operational pulse</h2>
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                Auto-refresh
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activities.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-300">{item.title}</p>
                    <span className="text-[11px] text-emerald-200">{item.change}</span>
                  </div>
                  <p className="mt-2 text-xl font-semibold text-white">{item.value}</p>
                  <p className="text-xs text-slate-400">{item.detail}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Quick actions</h2>
              <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">
                Mobile ready
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-200">
              <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/50 hover:text-white">
                Refresh live connections
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                  Sync
                </span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/50 hover:text-white">
                Send snapshot to Slack
                <span className="text-xs text-slate-300">Now</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/50 hover:text-white">
                Schedule push notification
                <span className="text-xs text-slate-300">09:00</span>
              </button>
              <button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-emerald-400/50 hover:text-white">
                Export CSV (mobile range)
                <span className="text-xs text-slate-300">CSV</span>
              </button>
            </div>
          </article>
        </section>

        <StocksPanel symbols={stockSymbols} initialData={stockData} defaultRange={90} />
      </main>
    </div>
  );
}
