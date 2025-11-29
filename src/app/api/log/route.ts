import { NextResponse } from "next/server";

type LogBody = {
  action?: string;
  detail?: unknown;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LogBody;
  console.info("[log]", body);
  return NextResponse.json({ ok: true }, { status: 200 });
}
