import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useEntityDialog } from "@/hooks/use-entity-dialog";

interface Unit {
  id: string;
  name: string;
}

const HALF: Unit = { id: "2", name: "Yarım" };

describe("useEntityDialog", () => {
  it("starts closed with nothing being edited", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.editing).toBeNull();
  });

  it("opens in create mode without an entity", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());

    act(() => result.current.openCreate());

    expect(result.current.isOpen).toBe(true);
    expect(result.current.editing).toBeNull();
  });

  it("opens in edit mode with the entity", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());

    act(() => result.current.openEdit(HALF));

    expect(result.current.isOpen).toBe(true);
    expect(result.current.editing).toEqual(HALF);
  });

  it("forgets the entity when closed", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());
    act(() => result.current.openEdit(HALF));

    act(() => result.current.close());

    expect(result.current.isOpen).toBe(false);
    expect(result.current.editing).toBeNull();
  });

  it("closes when the dialog asks to close through onOpenChange", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());
    act(() => result.current.openCreate());

    act(() => result.current.onOpenChange(false));

    expect(result.current.isOpen).toBe(false);
  });

  it("gives every opening a fresh session so a form can remount with it as its key", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());
    const initial = result.current.session;

    act(() => result.current.openCreate());
    const first = result.current.session;
    act(() => result.current.close());
    act(() => result.current.openEdit(HALF));
    const second = result.current.session;

    expect(first).toBe(initial + 1);
    expect(second).toBe(first + 1);
  });

  it("keeps the session while the dialog closes, so the exit animation is not cut short", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());
    act(() => result.current.openCreate());
    const opened = result.current.session;

    act(() => result.current.close());

    expect(result.current.session).toBe(opened);
  });

  it("ignores onOpenChange(true) so only openCreate/openEdit can open it", () => {
    const { result } = renderHook(() => useEntityDialog<Unit>());

    act(() => result.current.onOpenChange(true));

    expect(result.current.isOpen).toBe(false);
  });
});
