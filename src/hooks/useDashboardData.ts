"use client";

import { useCallback, useEffect, useState } from "react";
import type { StockSummary } from "@/types/stocks";

type DashboardData = {
  kpis: Array<{ title: string; value: string; change: string; status: string; bars: number[] }>;
  traffic: number[];
  segments: Array<{ name: string; share: number; lift: string }>;
  activities: Array<{ title: string; value: string; detail: string; change: string }>;
};

const DASHBOARD_ENDPOINT = "/api/dashboard";

async function fetchDashboard(period: string, segment: string): Promise<DashboardData> {
  const query = new URLSearchParams({ period, segment }).toString();
  const res = await fetch(`${DASHBOARD_ENDPOINT}?${query}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
  return res.json();
}

async function fetchStockSummary(symbol: string): Promise<StockSummary> {
  const res = await fetch(`/api/stocks?symbol=${symbol}&days=90`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load stock ${symbol} (${res.status})`);
  }
  return res.json();
}

export function useDashboardData(period: string, segment: string, symbols: string[]) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [dashLoading, setDashLoading] = useState(true);
  const [dashError, setDashError] = useState<string | null>(null);

  const [stockData, setStockData] = useState<Record<string, StockSummary>>({});
  const [stockLoading, setStockLoading] = useState(true);
  const [stockError, setStockError] = useState<string | null>(null);

  const refetchDashboard = useCallback(async () => {
    setDashLoading(true);
    try {
      const data = await fetchDashboard(period, segment);
      setDashboard(data);
      setDashError(null);
    } catch (err) {
      console.error(err);
      setDashError("ダッシュボードデータの取得に失敗しました");
      setDashboard(null);
    } finally {
      setDashLoading(false);
    }
  }, [period, segment]);

  const refetchStocks = useCallback(async () => {
    setStockLoading(true);
    try {
      const entries = await Promise.all(symbols.map((symbol) => fetchStockSummary(symbol).then((data) => [symbol, data] as const)));
      setStockData(Object.fromEntries(entries));
      setStockError(null);
    } catch (err) {
      console.error(err);
      setStockError("株価データの取得に失敗しました");
    } finally {
      setStockLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    refetchDashboard();
  }, [period, segment, refetchDashboard]);

  useEffect(() => {
    refetchStocks();
  }, [refetchStocks]);

  return {
    dashboard,
    dashLoading,
    dashError,
    refetchDashboard,
    stockData,
    stockLoading,
    stockError,
    refetchStocks,
  };
}
