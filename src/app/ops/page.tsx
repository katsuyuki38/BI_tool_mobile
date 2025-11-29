import Link from "next/link";

const checks = [
  { name: "API p95 latency", value: "142 ms", change: "-12 ms vs 1h", status: "Healthy" },
  { name: "Error rate", value: "0.14%", change: "-0.03pp", status: "Stable" },
  { name: "Webhook queue", value: "Under 3s", change: "Draining", status: "OK" },
  { name: "Push delivery", value: "98.6%", change: "+0.6pp", status: "Healthy" },
];

const incidents = [
  { title: "Auth callback 5xx", window: "12:10-12:22", impact: "13 reqs", status: "Auto-recovered" },
  { title: "EU edge timeouts", window: "09:35-09:40", impact: "0.4%", status: "Mitigated" },
];

export default function OpsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-200">Ops overview</p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">運用ヘルス（モック）</h1>
            <p className="text-sm text-slate-300">レイテンシ・エラー率・インシデントをモバイルで確認するプレースホルダ。</p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
          >
            ハブに戻る
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {checks.map((item) => (
            <article key={item.name} className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-300">{item.name}</p>
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                  {item.status}
                </span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
              <p className="text-xs text-emerald-200">{item.change}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">最近のインシデント</h2>
            <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">自動復旧</span>
          </div>
          <div className="mt-3 space-y-3">
            {incidents.map((incident) => (
              <div key={incident.title} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>{incident.title}</span>
                  <span className="text-xs text-slate-300">{incident.window}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>影響: {incident.impact}</span>
                  <span className="text-emerald-200">{incident.status}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-2xl border border-dashed border-white/15 px-4 py-3 text-xs text-slate-400">
            本画面はモックです。実データ接続時はSLO/SLIとアラート連携を表示予定。
          </div>
        </section>
      </main>
    </div>
  );
}
