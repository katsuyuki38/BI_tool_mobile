import { NextResponse } from "next/server";
import { loadStockSummary } from "@/lib/stocks";

const ALLOWED = new Set(["AAPL", "MSFT", "GOOG", "SPY"]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const symbol = (url.searchParams.get("symbol") || "AAPL").toUpperCase();
  const days = Number.parseInt(url.searchParams.get("days") || "90", 10);
  const range = Number.isFinite(days) && days > 0 ? Math.min(days, 365) : 90;

  if (!ALLOWED.has(symbol)) {
    return NextResponse.json({ error: "unsupported symbol" }, { status: 400 });
  }

  try {
    const summary = await loadStockSummary(symbol, range);
    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "failed to load stock data" }, { status: 500 });
  }
}
