import Link from "next/link";

const notifications = [
  { channel: "Slack", detail: "#bi-mobile", status: "有効", hint: "主要KPIのスナップショットを共有" },
  { channel: "Email", detail: "daily digest", status: "有効", hint: "朝9時に主要指標を送付" },
  { channel: "Push", detail: "iOS/Android", status: "準備中", hint: "重大アラートのみ" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-6">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-200">Config</p>
            <h1 className="text-2xl font-semibold text-white md:text-3xl">設定（モック）</h1>
            <p className="text-sm text-slate-300">通知・共有リンク・テーマ設定のプレースホルダ。サーバー側は未接続。</p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
          >
            ハブに戻る
          </Link>
        </header>

        <section className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white">通知チャンネル</h2>
            <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">モック</span>
          </div>
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.channel} className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
                <div className="flex items-center justify-between text-sm text-white">
                  <span>{item.channel}</span>
                  <span className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-slate-200">
                    {item.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.detail}</p>
                <p className="text-xs text-emerald-200">{item.hint}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-300">共有リンク</p>
            <h3 className="text-xl font-semibold text-white">Slack/Emailで共有</h3>
            <p className="text-xs text-slate-400">モック: 共有リンクは生成されません。</p>
            <button className="mt-3 w-full rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100">
              共有リンクを作成（ダミー）
            </button>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-300">テーマ</p>
            <h3 className="text-xl font-semibold text-white">ライト/ダーク</h3>
            <p className="text-xs text-slate-400">現状はダークのみ。ライトテーマ切替は未実装。</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-200">
              <span className="rounded-full border border-white/15 px-3 py-1">ダーク（固定）</span>
              <span className="rounded-full border border-dashed border-white/20 px-3 py-1">ライト（予定）</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
