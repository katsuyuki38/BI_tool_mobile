import { NextResponse } from "next/server";

type AdhocResponse = {
  period: string;
  dimension: string;
  summary: Array<{ label: string; value: string; change: string }>;
  rows: Array<{ label: string; sessions: number; revenue: number; cvr: number }>;
};

const baseRows: Record<string, Array<{ label: string; sessions: number; revenue: number; cvr: number }>> = {
  channel: [
    { label: "Organic", sessions: 42000, revenue: 4.2, cvr: 3.8 },
    { label: "Paid", sessions: 36000, revenue: 5.6, cvr: 4.1 },
    { label: "Referral", sessions: 18000, revenue: 1.9, cvr: 3.4 },
    { label: "Push", sessions: 14000, revenue: 1.1, cvr: 2.8 },
  ],
  device: [
    { label: "iOS", sessions: 48000, revenue: 5.4, cvr: 4.2 },
    { label: "Android", sessions: 42000, revenue: 4.6, cvr: 3.9 },
    { label: "Desktop", sessions: 26000, revenue: 3.1, cvr: 2.7 },
  ],
  region: [
    { label: "North", sessions: 22000, revenue: 2.6, cvr: 4.1 },
    { label: "East", sessions: 24000, revenue: 2.8, cvr: 3.8 },
    { label: "West", sessions: 18000, revenue: 2.1, cvr: 3.5 },
    { label: "South", sessions: 16000, revenue: 1.9, cvr: 3.2 },
  ],
};

const periodMultiplier: Record<string, number> = { "7": 0.32, "30": 1, "90": 2.1 };

function buildResponse(period: string, dimension: string): AdhocResponse {
  const mult = periodMultiplier[period] ?? periodMultiplier["30"];
  const rows = baseRows[dimension] ?? baseRows.channel;

  const adjusted = rows.map((row) => ({
    ...row,
    sessions: Math.round(row.sessions * mult),
    revenue: Number((row.revenue * mult).toFixed(1)),
    cvr: Number(row.cvr.toFixed(1)),
  }));

  const totalSessions = adjusted.reduce((sum, r) => sum + r.sessions, 0);
  const totalRevenue = adjusted.reduce((sum, r) => sum + r.revenue, 0);
  const avgCvr = adjusted.reduce((sum, r) => sum + r.cvr, 0) / adjusted.length;

  return {
    period,
    dimension,
    summary: [
      { label: "セッション", value: `${(totalSessions / 1000).toFixed(1)}K`, change: "+3〜8%" },
      { label: "売上", value: `JPY ${(totalRevenue / 10).toFixed(1)}M`, change: "+5〜10%" },
      { label: "CVR", value: `${avgCvr.toFixed(1)}%`, change: "+0.2pp" },
    ],
    rows: adjusted,
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const period = url.searchParams.get("period") ?? "30";
  const dimension = url.searchParams.get("dimension") ?? "channel";
  const empty = url.searchParams.get("empty") === "1";

  if (empty) {
    return NextResponse.json<AdhocResponse>({
      period,
      dimension,
      summary: [],
      rows: [],
    });
  }

  const payload = buildResponse(period, dimension);
  return NextResponse.json<AdhocResponse>(payload, { status: 200 });
}
