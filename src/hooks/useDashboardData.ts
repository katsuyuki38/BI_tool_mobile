"use client";

import useSWR from "swr";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { StockSummary } from "@/types/stocks";

type DashboardData = {
  kpis: Array<{ title: string; value: string; change: string; status: string; bars: number[] }>;
  traffic: number[];
  segments: Array<{ name: string; share: number; lift: string }>;
  activities: Array<{ title: string; value: string; detail: string; change: string }>;
};

const DASHBOARD_ENDPOINT = "/api/dashboard";

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error(`Failed to load dashboard (${res.status})`);
    return res.json() as Promise<DashboardData>;
  });

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

  const cacheKey = useMemo(
    () => `${DASHBOARD_ENDPOINT}?${new URLSearchParams({ period, segment }).toString()}`,
    [period, segment],
  );
  const { data, isLoading, error, mutate } = useSWR<DashboardData>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

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
    setDashboard(data ?? null);
    setDashError(error ? "ダッシュボードデータの取得に失敗しました" : null);
    setDashLoading(isLoading);
  }, [data, error, isLoading]);

  useEffect(() => {
    refetchStocks();
  }, [refetchStocks]);

  return {
    dashboard,
    dashLoading,
    dashError,
    refetchDashboard: mutate,
    stockData,
    stockLoading,
    stockError,
    refetchStocks,
  };
}
