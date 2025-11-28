export type StockPoint = {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockSummary = {
  symbol: string;
  latestClose: number;
  changePct: number;
  weeklyChangePct: number;
  series: StockPoint[];
};
