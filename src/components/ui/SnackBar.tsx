"use client";

import { useEffect } from "react";

const DEFAULT_DURATION_MS = 4000;

interface SnackBarProps {
  message: string | null;
  onClose: () => void;
  durationMs?: number;
}

/** Bottom-right error toast, modelled on Angular Material's `mat-snack-bar`. */
export default function SnackBar({
  message,
  onClose,
  durationMs = DEFAULT_DURATION_MS,
}: SnackBarProps) {
  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(onClose, durationMs);
    return () => window.clearTimeout(timer);
  }, [message, durationMs, onClose]);

  if (!message) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999999]">
      <div
        role="alert"
        className="pointer-events-auto absolute right-2 bottom-2 flex w-[500px] max-w-[calc(100vw-16px)] animate-[snackbar-in_150ms_cubic-bezier(0,0,0.2,1)] items-center rounded-[4px] bg-[#f55145] pr-2 text-white shadow-[0_3px_5px_-1px_rgba(0,0,0,0.2),0_6px_10px_0_rgba(0,0,0,0.14),0_1px_18px_0_rgba(0,0,0,0.12),0_4px_20px_0_rgba(0,0,0,0.14),0_7px_10px_-5px_rgba(244,67,54,0.4)]"
      >
        <div className="flex-1 overflow-auto py-[14px] pr-2 pl-4">{message}</div>
        <button
          type="button"
          onClick={onClose}
          className="h-9 min-w-16 cursor-pointer rounded-[4px] px-2 font-medium text-white hover:bg-white/10"
        >
          X
        </button>
      </div>
    </div>
  );
}
