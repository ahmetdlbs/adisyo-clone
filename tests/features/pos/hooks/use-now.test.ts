import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useNow } from "@/features/pos/hooks/use-now";

beforeEach(() => vi.useFakeTimers({ now: new Date("2026-09-21T12:00:00.000Z") }));
afterEach(() => vi.useRealTimers());

describe("useNow", () => {
  it("gives the current time once mounted", () => {
    const { result } = renderHook(() => useNow());

    expect(result.current?.toISOString()).toBe("2026-09-21T12:00:00.000Z");
  });

  it("moves forward on its own", () => {
    const { result } = renderHook(() => useNow());

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(result.current?.toISOString()).toBe("2026-09-21T12:00:30.000Z");
  });

  it("shares one clock between every reader", () => {
    const first = renderHook(() => useNow());
    const second = renderHook(() => useNow());

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(first.result.current).toBe(second.result.current);
  });

  it("stops ticking once nothing reads it", () => {
    const { unmount } = renderHook(() => useNow());

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
