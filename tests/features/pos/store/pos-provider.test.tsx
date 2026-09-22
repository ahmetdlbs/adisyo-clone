import { describe, expect, it } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { createEmptyPosState, type PosState } from "@/features/pos/model/pos-state";
import { createPosStore, PosProvider, usePosActions, usePosState } from "@/features/pos/store/pos-provider";

const initial: PosState = {
  ...createEmptyPosState(),
  areas: [{ id: "a1", name: "Salon" }],
  tables: [{ id: "t1", name: "Masa 1", areaId: "a1", shape: "square" }],
};

function wrapperFor(store = createPosStore({ initial, storage: null })) {
  return { store, wrapper: ({ children }: { children: ReactNode }) => <PosProvider store={store}>{children}</PosProvider> };
}

describe("PosProvider", () => {
  it("refuses hooks used outside of it", () => {
    expect(() => renderHook(() => usePosState())).toThrow("PosProvider");
  });

  it("gives components the current state", () => {
    const { wrapper } = wrapperFor();

    const { result } = renderHook(() => usePosState(), { wrapper });

    expect(result.current.tables.map((table) => table.name)).toEqual(["Masa 1"]);
  });

  it("re-renders readers when an action changes the state", () => {
    const { wrapper } = wrapperFor();
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    act(() => {
      result.current.actions.openOrder({ type: "table", tableId: "t1", waiter: "ahmet" });
    });

    expect(result.current.state.orders).toHaveLength(1);
  });

  it("returns the id of the order it opened", () => {
    const { wrapper } = wrapperFor();
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });
    let id = "";

    act(() => {
      id = result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
    });

    expect(result.current.state.orders[0]?.id).toBe(id);
  });

  it("applies a catalog change and lets its error through untouched", () => {
    const { wrapper } = wrapperFor();
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    act(() => {
      result.current.actions.change((state) => ({ ...state, areas: [...state.areas, { id: "a2", name: "Bahçe" }] }));
    });
    expect(result.current.state.areas.map((area) => area.name)).toEqual(["Salon", "Bahçe"]);

    expect(() =>
      result.current.actions.change(() => {
        throw new Error("Bu bölge zaten tanımlı");
      })
    ).toThrow("Bu bölge zaten tanımlı");
    expect(result.current.state.areas).toHaveLength(2);
  });

  it("keeps the actions object stable so effects and memos do not re-run", () => {
    const { wrapper } = wrapperFor();
    const { result, rerender } = renderHook(() => usePosActions(), { wrapper });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("closes a settled order into the history and cancels others, keeping both on record", () => {
    const { wrapper } = wrapperFor();
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    act(() => {
      const id = result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
      result.current.actions.closeOrder(id);
      const other = result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
      result.current.actions.cancelOrder(other);
    });

    expect(result.current.state.history.map((entry) => entry.outcome)).toEqual(["paid", "cancelled"]);
    expect(result.current.state.orders).toEqual([]);
  });

  it("shares one store between everything below it", () => {
    const { wrapper } = wrapperFor();
    function Reader() {
      return <p>{usePosState().orders.length} açık sipariş</p>;
    }
    function Writer() {
      const actions = usePosActions();
      return (
        <button type="button" onClick={() => actions.openOrder({ type: "delivery", tableId: null, waiter: "ahmet" })}>
          Aç
        </button>
      );
    }

    render(
      <>
        <Writer />
        <Reader />
      </>,
      { wrapper }
    );
    act(() => screen.getByRole("button", { name: "Aç" }).click());

    expect(screen.getByText("1 açık sipariş")).toBeInTheDocument();
  });
});
