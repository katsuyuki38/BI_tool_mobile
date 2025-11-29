import { NextResponse } from "next/server";

export type ShareResponse = {
  url: string;
  expiresAt: string;
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const path = typeof body?.path === "string" ? body.path : "/";
  const now = new Date();
  const expires = new Date(now.getTime() + 1000 * 60 * 60); // +1h mock
  const url = `https://example.local/share${path}?token=mock-${Math.random().toString(36).slice(2, 8)}`;
  return NextResponse.json<ShareResponse>({ url, expiresAt: expires.toISOString() }, { status: 200 });
}
