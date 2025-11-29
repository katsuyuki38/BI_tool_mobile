import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";
  return NextResponse.json({ message: `Slackへスナップショット送信（モック）: ${path}` }, { status: 200 });
}
