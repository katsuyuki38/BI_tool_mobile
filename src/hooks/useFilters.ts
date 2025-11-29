"use client";

import { useState } from "react";

type Options = {
  period: string;
  segment: string;
};

export function useFilters(initial: Options = { period: "30", segment: "all" }) {
  const [period, setPeriod] = useState(initial.period);
  const [segment, setSegment] = useState(initial.segment);

  return { period, segment, setPeriod, setSegment };
}
