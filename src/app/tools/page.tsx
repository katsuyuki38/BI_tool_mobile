import Link from "next/link";

const tools = [
  {
    name: "ダッシュボード",
    desc: "主要KPIとトレンドをモバイル向けに最適化。",
    badge: "Live",
    href: "/",
    tone: "rgba(16,185,129,0.28), rgba(52,211,153,0.22), rgba(255,255,255,0.80)",
  },
  {
    name: "アドホック分析",
    desc: "簡易なフィルタとビュー切替で即席分析。",
    badge: "Beta",
    href: "/adhoc",
    tone: "rgba(59,130,246,0.25), rgba(34,211,238,0.22), rgba(255,255,255,0.80)",
  },
  {
    name: "運用ヘルス",
    desc: "レイテンシ・エラー率・アラートの健康状態を確認。",
    badge: "Ops",
    href: "/ops",
    tone: "rgba(249,115,22,0.24), rgba(251,146,60,0.20), rgba(255,255,255,0.80)",
  },
  {
    name: "設定",
    desc: "通知・共有リンク・テーマなどの管理。",
    badge: "Config",
    href: "/settings",
    tone: "rgba(148,163,184,0.24), rgba(100,116,139,0.20), rgba(255,255,255,0.78)",
  },
];

const recents = ["ダッシュボード（売上・利用）", "アドホック分析: 7日間 / Mobile", "設定: Slack通知"];

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-8">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100">
              BIツール ハブ
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-white md:text-3xl">次の操作を選択</h1>
              <p className="text-sm text-slate-300">
                よく使うビューを上に表示。ダッシュボード、アドホック分析、設定へ素早くアクセス。
              </p>
            </div>
          </div>
          <Link
            href="/login"
            className="w-full rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100 sm:w-auto"
          >
            アカウント切替
          </Link>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-5 shadow-[0_25px_80px_-50px_rgba(0,0,0,0.8)] transition hover:-translate-y-1 hover:border-emerald-400/40"
            >
              <div
                className="absolute inset-0 blur-3xl"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${tool.tone})` }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-emerald-200">{tool.badge}</p>
                  <h2 className="text-xl font-semibold text-white">{tool.name}</h2>
                  <p className="text-sm text-slate-200">{tool.desc}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm text-white">
                  →
                </div>
              </div>
            </Link>
          ))}
        </section>

        <section className="space-y-2 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <h3 className="text-sm font-semibold text-white">最近使った</h3>
          <ul className="space-y-2 text-sm text-slate-200">
            {recents.map((item) => (
              <li key={item} className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                <span>{item}</span>
                <span className="text-xs text-emerald-200">再開</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-3 rounded-3xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-300">共通アクション</p>
              <h3 className="text-lg font-semibold text-white">通知・共有・エクスポート</h3>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">ショートカット</span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {["Slackへスナップショット", "CSVエクスポート", "アラート設定を開く"].map((action) => (
              <button
                key={action}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                {action}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
