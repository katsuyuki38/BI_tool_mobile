"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";

const features = [
  "スマホ最適化ビューで主要KPIを即確認",
  "アラート/共有をすぐ実行できるクイックアクション",
  "ダッシュボード・アドホック分析・設定へワンタップ遷移",
];

type AuthAction = "send-code" | "login";

type AuthResponse =
  | { status: "sent"; message: string; codeHint: string }
  | { status: "ok"; message: string; trusted: boolean; sessionExpiry: number }
  | { status: "error"; message: string };

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<AuthAction | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [codeHint, setCodeHint] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  const emailOk = useMemo(() => isValidEmail(email.trim()), [email]);
  const codeOk = useMemo(() => /^[0-9]{6}$/.test(code.trim()), [code]);

  const callMockAuth = async (action: AuthAction) => {
    setBusy(action);
    setInfo(null);
    setError(null);
    try {
      const res = await fetch("/api/auth/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, action }),
      });
      const data = (await res.json()) as AuthResponse;

      if (!res.ok || data.status === "error") {
        setError(data.message || "エラーが発生しました");
        return;
      }

      if (data.status === "sent") {
        setCodeHint(data.codeHint);
        setInfo(data.message);
      }

      if (data.status === "ok") {
        setInfo(`${data.message}（セッション30分有効）`);
        try {
          localStorage.setItem(
            "bi-mobile-session",
            JSON.stringify({ email, sessionExpiry: data.sessionExpiry }),
          );
          setSessionEmail(email);
        } catch (storageError) {
          console.error(storageError);
        }
        setTimeout(() => router.push("/tools"), 400);
      }
    } catch (err) {
      console.error(err);
      setError("ネットワークまたはサーバーエラーが発生しました");
    } finally {
      setBusy(null);
    }
  };

  const handleSendCode = () => {
    if (!emailOk) {
      setError("メール形式を確認してください");
      return;
    }
    callMockAuth("send-code");
  };

  const handleLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!emailOk) {
      setError("メール形式を確認してください");
      return;
    }
    if (!codeOk) {
      setError("6桁のコードを入力してください");
      return;
    }
    callMockAuth("login");
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("bi-mobile-session");
      if (!raw) return;
      const session = JSON.parse(raw) as { email?: string; sessionExpiry?: number };
      if (session.sessionExpiry && session.sessionExpiry > Date.now()) {
        setSessionEmail(session.email ?? null);
        setInfo("既にサインイン済みです。ハブに移動します。");
        setTimeout(() => router.push("/tools"), 400);
      } else {
        localStorage.removeItem("bi-mobile-session");
      }
    } catch (err) {
      console.error(err);
    }
  }, [router]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("bi-mobile-session");
      setSessionEmail(null);
      setInfo("セッションをクリアしました。再度サインインしてください。");
    } catch (err) {
      console.error(err);
      setError("ログアウト処理に失敗しました");
    }
  };

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
          <form className="space-y-3" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-semibold text-white">メールアドレス</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-white">ワンタイムコード</label>
              <input
                type="text"
                placeholder="6桁コード"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/15 bg-slate-900/60 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400/60 focus:outline-none"
                inputMode="numeric"
                autoComplete="one-time-code"
              />
              <div className="mt-2 text-xs text-slate-400">
                コード未取得の場合は「コードを送信」を押してください。モック環境では {codeHint ?? "123456"} が常に有効です。
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleSendCode}
                disabled={busy !== null}
                className={`w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-emerald-500/15 transition hover:-translate-y-0.5 hover:shadow-xl sm:w-auto ${
                  busy ? "opacity-70" : ""
                }`}
              >
                コードを送信
              </button>
              <button
                type="submit"
                disabled={busy !== null}
                className={`w-full rounded-2xl border border-emerald-400/60 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-white sm:w-auto ${
                  busy ? "opacity-70" : ""
                }`}
              >
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
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span>
                {sessionEmail ? `現在のモックセッション: ${sessionEmail}` : "未サインイン"}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold text-white transition hover:border-emerald-400/50 hover:text-emerald-100"
              >
                セッションをクリア
              </button>
            </div>
            {error && (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}
            {info && (
              <div className="rounded-2xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                {info}
              </div>
            )}
            {busy && (
              <div className="text-xs text-slate-400">
                {busy === "send-code" ? "コード送信中…" : "ログイン処理中…"}
              </div>
            )}
          </form>
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
