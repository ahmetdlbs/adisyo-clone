"use client";

import { useSyncExternalStore } from "react";

const TICK_MS = 30_000;

// One clock shared by every reader, so a screen full of "4 s 20 dk" labels costs a single timer.
const listeners = new Set<() => void>();
let current: Date | null = null;
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    current = new Date();
    timer = setInterval(() => {
      current = new Date();
      listeners.forEach((notify) => notify());
    }, TICK_MS);
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && timer !== undefined) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

const getSnapshot = () => current;
const getServerSnapshot = () => null;

/**
 * The current time, refreshed every 30 seconds. `null` on the server and during hydration, so anything that
 * depends on the clock (elapsed times, time of day) renders after mount and never mismatches server HTML.
 */
export function useNow(): Date | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
