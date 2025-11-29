import { NextResponse } from "next/server";

type AuthAction = "send-code" | "login";

type AuthRequest = {
  email?: string;
  code?: string;
  action?: AuthAction;
};

type AuthResponse =
  | { status: "sent"; message: string; codeHint: string }
  | { status: "ok"; message: string; trusted: boolean; sessionExpiry: number }
  | { status: "error"; message: string };

const SUCCESS_CODE = "123456";

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidCode = (code: string) => /^[0-9]{6}$/.test(code);

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as AuthRequest;
    const action: AuthAction = body.action ?? "send-code";
    const email = (body.email || "").trim().toLowerCase();
    const code = (body.code || "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json<AuthResponse>({ status: "error", message: "メール形式を確認してください" }, { status: 400 });
    }

    if (action === "send-code") {
      return NextResponse.json<AuthResponse>(
        {
          status: "sent",
          message: `${email} にワンタイムコードを送信しました（モック）`,
          codeHint: SUCCESS_CODE,
        },
        { status: 200 },
      );
    }

    if (!isValidCode(code)) {
      return NextResponse.json<AuthResponse>(
        { status: "error", message: "6桁のワンタイムコードを入力してください" },
        { status: 400 },
      );
    }

    if (code !== SUCCESS_CODE) {
      return NextResponse.json<AuthResponse>(
        { status: "error", message: "コードが無効です。最新コードを再送してください。" },
        { status: 401 },
      );
    }

    const sessionExpiry = Date.now() + 1000 * 60 * 30; // 30min mock session
    return NextResponse.json<AuthResponse>(
      { status: "ok", message: "ログインに成功しました（モック）", trusted: true, sessionExpiry },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json<AuthResponse>({ status: "error", message: "認証処理でエラーが発生しました" }, { status: 500 });
  }
}
