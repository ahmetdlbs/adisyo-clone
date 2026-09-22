import { describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { usePagination } from "@/hooks/use-pagination";

const numbers = (count: number) => Array.from({ length: count }, (_, index) => index + 1);

describe("usePagination", () => {
  it("starts on the first page", () => {
    const { result } = renderHook(() => usePagination(numbers(25), 10));

    expect(result.current).toMatchObject({ page: 1, pageCount: 3, pageItems: numbers(10) });
  });

  it("moves to another page", () => {
    const { result } = renderHook(() => usePagination(numbers(25), 10));

    act(() => result.current.setPage(3));

    expect(result.current.page).toBe(3);
    expect(result.current.pageItems).toEqual([21, 22, 23, 24, 25]);
  });

  it("does not let a page go past the ends", () => {
    const { result } = renderHook(() => usePagination(numbers(25), 10));

    act(() => result.current.setPage(99));
    expect(result.current.page).toBe(3);

    act(() => result.current.setPage(-1));
    expect(result.current.page).toBe(1);
  });

  it("falls back to the last page when the list shrinks under the current one", () => {
    const { result, rerender } = renderHook(({ items }) => usePagination(items, 10), { initialProps: { items: numbers(25) } });
    act(() => result.current.setPage(3));

    rerender({ items: numbers(12) });

    expect(result.current.page).toBe(2);
    expect(result.current.pageItems).toEqual([11, 12]);
  });

  it("goes back to the first page on reset, e.g. when a search changes", () => {
    const { result } = renderHook(() => usePagination(numbers(25), 10));
    act(() => result.current.setPage(2));

    act(() => result.current.reset());

    expect(result.current.page).toBe(1);
  });
});
