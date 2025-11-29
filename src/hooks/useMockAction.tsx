"use client";

import { useState } from "react";
import { Toast } from "@/components/Toast";

type ToastState = { message: string; type: "success" | "error" };

export function useMockAction() {
  const [toast, setToast] = useState<ToastState | null>(null);

  const trigger = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const ToastSlot = toast ? <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /> : null;

  return { trigger, ToastSlot };
}
