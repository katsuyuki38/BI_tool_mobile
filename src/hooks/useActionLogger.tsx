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
      await fetch("/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { log };
}
