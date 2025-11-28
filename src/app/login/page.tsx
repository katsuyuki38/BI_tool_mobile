import Link from "next/link";

const features = [
  "スマホ最適化ビューで主要KPIを即確認",
  "アラート/共有をすぐ実行できるクイックアクション",
  "ダッシュボード・アドホック分析・設定へワンタップ遷移",
];

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <main className="mx-auto flex max-w-xl flex-col gap-8 px-5 py-8">
        <header className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
            Mobile BI Access
          </div>
          <h1 className="text-2xl font-semibold text-white md:text-3xl">
            サインインしてモバイルBIへ
          </h1>
          <p className="text-sm text-slate-300">
            メールを入力し、ワンタイムコードでログインします。端末を信頼済みにすると次回以降スムーズにアクセスできます。
          </p>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-[0_25px_80px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-white">メールアドレス</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white">ワンタイムコード</label>
              <input
                type="text"
                placeholder="6桁コード"
                className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
              />
              <div className="mt-2 text-xs text-slate-400">コード未取得の場合は「コードを送信」を押してください。</div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto">
                コードを送信
              </button>
              <button className="w-full rounded-2xl border border-emerald-400/60 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-white sm:w-auto">
                ログインして続行
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="h-px w-10 bg-white/10" />
              または
              <span className="h-px w-10 bg-white/10" />
            </div>
            <Link
              href="/tools"
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
            >
              サインイン後のハブを見る
            </Link>
          </div>
        </section>

        <section className="space-y-2 rounded-3xl border border-white/10 bg-slate-900/50 p-5 backdrop-blur">
          <h2 className="text-sm font-semibold text-white">このアプリでできること</h2>
          <ul className="space-y-2 text-sm text-slate-200">
            {features.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="text-xs text-slate-500">
          セキュリティ: 信頼済み端末のみアクセスを許可。ログアウトするとキャッシュされたデータは破棄されます。
        </footer>
      </main>
    </div>
  );
}
