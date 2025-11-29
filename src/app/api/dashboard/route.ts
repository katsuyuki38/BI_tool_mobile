import { NextResponse } from "next/server";

export type DashboardResponse = {
  kpis: Array<{
    title: string;
    value: string;
    change: string;
    status: string;
    bars: number[];
  }>;
  traffic: number[];
  segments: Array<{ name: string; share: number; lift: string }>;
  activities: Array<{ title: string; value: string; detail: string; change: string }>;
};

const basePayload: DashboardResponse = {
  kpis: [
    { title: "Total Revenue", value: "JPY 12.8M", change: "+8.1% vs 7d", status: "Live", bars: [32, 54, 48, 62, 58, 66, 72, 64] },
    { title: "Active Users", value: "28.4K", change: "+2.4% vs 7d", status: "Realtime", bars: [18, 26, 22, 30, 28, 34, 36, 40] },
    { title: "Conversion", value: "3.9%", change: "+0.3pp", status: "Steady", bars: [22, 20, 24, 26, 28, 30, 32, 31] },
    { title: "Retention D30", value: "71%", change: "+1.1pp", status: "Healthy", bars: [60, 62, 63, 64, 65, 67, 68, 71] },
  ],
  traffic: [38, 44, 40, 52, 58, 54, 63, 72, 64, 70, 75, 78],
  segments: [
    { name: "Mobile checkout", share: 64, lift: "+6.2%" },
    { name: "Organic search", share: 48, lift: "+3.1%" },
    { name: "Referral partners", share: 36, lift: "+4.8%" },
    { name: "In-app prompts", share: 28, lift: "+2.4%" },
  ],
  activities: [
    { title: "Orders", value: "2.4K", detail: "today", change: "+5.4%" },
    { title: "Avg ticket", value: "JPY 4.7K", detail: "per order", change: "+1.9%" },
    { title: "Support CSAT", value: "4.6 / 5", detail: "mobile chats", change: "stable" },
    { title: "Latency", value: "142 ms", detail: "p95 API", change: "-12 ms" },
  ],
};

const periodMultiplier: Record<string, number> = {
  "7": 0.35,
  "30": 1,
  "90": 2.2,
};

const segmentAdjust: Record<string, number> = {
  all: 1,
  mobile: 1.15,
  desktop: 0.9,
};

function applyAdjustments(period: string, segment: string): DashboardResponse {
  const p = periodMultiplier[period] ?? periodMultiplier["30"];
  const s = segmentAdjust[segment] ?? segmentAdjust.all;
  const factor = p * s;

  const scaleValue = (value: string) => {
    if (value.startsWith("JPY")) {
      const num = Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0;
      return `JPY ${(num * factor).toFixed(1)}M`;
    }
    if (value.endsWith("K")) {
      const num = Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0;
      return `${(num * factor).toFixed(1)}K`;
    }
    return value;
  };

  return {
    kpis: basePayload.kpis.map((kpi) => ({
      ...kpi,
      value: scaleValue(kpi.value),
      bars: kpi.bars.map((b) => Math.round(b * factor)),
    })),
    traffic: basePayload.traffic.map((t) => Math.round(t * factor)),
    segments: basePayload.segments.map((seg) => ({
      ...seg,
      share: Math.min(100, Math.round(seg.share * s)),
      lift: seg.lift,
    })),
    activities: basePayload.activities.map((a) => ({
      ...a,
      value: a.value.includes("K") ? `${(Number.parseFloat(a.value) * factor).toFixed(1)}K` : a.value,
    })),
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const empty = url.searchParams.get("empty") === "1";
  const period = url.searchParams.get("period") ?? "30";
  const segment = url.searchParams.get("segment") ?? "all";

  if (empty) {
    return NextResponse.json<DashboardResponse>({ ...basePayload, kpis: [], traffic: [], segments: [], activities: [] });
  }

  const payload = applyAdjustments(period, segment);
  return NextResponse.json<DashboardResponse>(payload, { status: 200 });
}
