"use client";

import useSWR from "swr";

type AdhocRow = { label: string; sessions: number; revenue: number; cvr: number };
type AdhocResponse = {
  period: string;
  dimension: string;
  summary: Array<{ label: string; value: string; change: string }>;
  rows: AdhocRow[];
};

const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => {
    if (!res.ok) throw new Error(`Failed to load adhoc (${res.status})`);
    return res.json() as Promise<AdhocResponse>;
  });

export function useAdhocData(period: string, dimension: string) {
  const cacheKey = `/api/adhoc?${new URLSearchParams({ period, dimension }).toString()}`;
  const { data, error, isLoading, mutate } = useSWR<AdhocResponse>(cacheKey, fetcher, {
    revalidateOnFocus: false,
    shouldRetryOnError: false,
  });

  return {
    data,
    error,
    loading: isLoading,
    refetch: mutate,
  };
}
