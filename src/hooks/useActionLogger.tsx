"use client";

import { useCallback } from "react";

type LogPayload = {
  action: string;
  detail?: Record<string, unknown>;
};

export function useActionLogger() {
  const log = useCallback(async (payload: LogPayload) => {
    try {
      console.info("[mock-log]", payload);
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { log };
}
