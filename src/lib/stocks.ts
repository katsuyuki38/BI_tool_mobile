import { promises as fs } from "fs";
import path from "path";
import type { StockPoint, StockSummary } from "@/types/stocks";

const symbolFileMap: Record<string, string> = {
  AAPL: "aapl.csv",
  MSFT: "msft.csv",
  GOOG: "goog.csv",
  SPY: "spy.csv",
};

const parseNumber = (value: string) => Number.parseFloat(value || "0");

async function readCsv(symbol: string): Promise<StockPoint[]> {
  const file = symbolFileMap[symbol.toUpperCase()];
  if (!file) {
    throw new Error(`Unsupported symbol: ${symbol}`);
  }

  const csvPath = path.join(process.cwd(), "data", "stocks", file);
  const raw = await fs.readFile(csvPath, "utf-8");
  const lines = raw.trim().split(/\r?\n/);
  // Skip header row (Polish column names).
  const rows = lines.slice(1);

  return rows
    .map((line) => line.split(","))
    .filter((cols) => cols.length >= 6)
    .map((cols) => ({
      date: cols[0],
      open: parseNumber(cols[1]),
      high: parseNumber(cols[2]),
      low: parseNumber(cols[3]),
      close: parseNumber(cols[4]),
      volume: parseNumber(cols[5]),
    }))
    .sort((a, b) => a.date.localeCompare(b.date)); // ascending by date
}

function computeChangePct(current: number, previous: number): number {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
}

export async function loadStockSummary(
  symbol: string,
  days: number = 90,
): Promise<StockSummary> {
  const series = await readCsv(symbol);
  const recent = series.slice(-days);
  const latest = recent[recent.length - 1];
  const prev = recent[recent.length - 2];
  const weekAgo = recent[recent.length - 6] ?? prev ?? latest;

  return {
    symbol: symbol.toUpperCase(),
    latestClose: latest?.close ?? 0,
    changePct: computeChangePct(latest?.close ?? 0, prev?.close ?? 0),
    weeklyChangePct: computeChangePct(latest?.close ?? 0, weekAgo?.close ?? 0),
    series: recent,
  };
}

export async function loadMultipleSummaries(symbols: string[], days = 90) {
  const entries = await Promise.all(
    symbols.map(async (symbol) => [symbol, await loadStockSummary(symbol, days)] as const),
  );
  return Object.fromEntries(entries) as Record<string, StockSummary>;
}
