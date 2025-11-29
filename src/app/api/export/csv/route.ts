import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const period = body?.period ?? "30";
  const segment = body?.segment ?? "all";
  const filename = `export_${period}d_${segment}.csv`;
  return NextResponse.json({ message: "CSVエクスポート（モック）を開始しました", filename }, { status: 200 });
}
