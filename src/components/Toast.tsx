"use client";

import { useEffect, useState } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose?: () => void;
  duration?: number;
};

export function Toast({ message, type = "success", onClose, duration = 2800 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-auto fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-xl items-center gap-2 rounded-2xl px-4 py-3 text-sm shadow-lg backdrop-blur ${
        type === "success"
          ? "border border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
          : "border border-rose-400/40 bg-rose-500/10 text-rose-50"
      }`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="ml-auto text-xs text-white/70 hover:text-white"
      >
        閉じる
      </button>
    </div>
  );
}
