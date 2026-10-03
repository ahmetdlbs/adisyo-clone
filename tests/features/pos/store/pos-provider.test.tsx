import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, renderHook, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import type { Order } from "@/features/pos/model/order";
import { ORDERS_POLL_MS, PosProvider, usePosActions, usePosState, type PosSnapshot } from "@/features/pos/store/pos-provider";

const orderActions = vi.hoisted(() => ({
  openOrderAction: vi.fn(),
  closeOrderAction: vi.fn(),
  cancelOrderAction: vi.fn(),
  fetchOpenOrders: vi.fn(),
}));
vi.mock("@/features/pos/server/order-actions", () => orderActions);

const floorPlanActions = vi.hoisted(() => ({ saveAreaAction: vi.fn() }));
vi.mock("@/features/pos/server/floor-plan-actions", () => floorPlanActions);

beforeEach(() => {
  orderActions.openOrderAction.mockReset();
  orderActions.closeOrderAction.mockReset();
  orderActions.cancelOrderAction.mockReset();
  floorPlanActions.saveAreaAction.mockReset();
});

const initial: PosSnapshot = {
  areas: [{ id: "a1", name: "Salon" }],
  tables: [{ id: "t1", name: "Masa 1", areaId: "a1", shape: "square" }],
  categories: [],
  products: [],
  orders: [],
};

const NOW = new Date("2026-09-21T12:00:00.000Z");

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "o1",
    number: 1,
    type: "takeaway",
    tableId: null,
    waiter: "ahmet",
    openedAt: NOW.toISOString(),
    stage: "preparing",
    status: "open",
    closedAt: null,
    lines: [],
    discountPercent: 0,
    payments: [],
    ...overrides,
  };
}

function wrapper({ children }: { children: ReactNode }) {
  return <PosProvider initial={initial}>{children}</PosProvider>;
}

describe("PosProvider", () => {
  it("refuses hooks used outside of it", () => {
    expect(() => renderHook(() => usePosState())).toThrow("PosProvider");
  });

  it("gives components the seeded snapshot", () => {
    const { result } = renderHook(() => usePosState(), { wrapper });

    expect(result.current.tables.map((table) => table.name)).toEqual(["Masa 1"]);
  });

  it("re-renders readers once an action's server call resolves, and returns the new order's id", async () => {
    orderActions.openOrderAction.mockResolvedValue(makeOrder({ id: "new-order" }));
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    let id = "";
    await act(async () => {
      id = await result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
    });

    expect(id).toBe("new-order");
    expect(result.current.state.orders).toHaveLength(1);
    expect(result.current.state.orders[0]?.id).toBe("new-order");
  });

  it("lets a rejected server call's error through untouched", async () => {
    floorPlanActions.saveAreaAction.mockRejectedValue(new Error("Bu bölge zaten tanımlı"));
    const { result } = renderHook(() => usePosActions(), { wrapper });

    await expect(result.current.saveArea(null, "Salon")).rejects.toThrow("Bu bölge zaten tanımlı");
  });

  it("keeps the actions object stable so effects and memos do not re-run", () => {
    const { result, rerender } = renderHook(() => usePosActions(), { wrapper });
    const first = result.current;

    rerender();

    expect(result.current).toBe(first);
  });

  it("removes a closed or cancelled order from the live snapshot", async () => {
    orderActions.openOrderAction
      .mockResolvedValueOnce(makeOrder({ id: "closes" }))
      .mockResolvedValueOnce(makeOrder({ id: "cancels" }));
    orderActions.closeOrderAction.mockResolvedValue(makeOrder({ id: "closes", status: "paid" }));
    orderActions.cancelOrderAction.mockResolvedValue(makeOrder({ id: "cancels", status: "cancelled" }));
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    await act(async () => {
      const closesId = await result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
      await result.current.actions.closeOrder(closesId);
      const cancelsId = await result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "ahmet" });
      await result.current.actions.cancelOrder(cancelsId);
    });

    expect(result.current.state.orders).toEqual([]);
  });

  it("shares one snapshot between everything below it", async () => {
    orderActions.openOrderAction.mockResolvedValue(makeOrder());
    function Reader() {
      return <p>{usePosState().orders.length} açık sipariş</p>;
    }
    function Writer() {
      const actions = usePosActions();
      return (
        <button type="button" onClick={() => void actions.openOrder({ type: "delivery", tableId: null, waiter: "ahmet" })}>
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
    await act(async () => screen.getByRole("button", { name: "Aç" }).click());

    expect(screen.getByText("1 açık sipariş")).toBeInTheDocument();
  });
});

describe("live sync", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    orderActions.fetchOpenOrders.mockReset();
  });
  afterEach(() => vi.useRealTimers());

  const wrapper = ({ children }: { children: ReactNode }) => (
    <PosProvider initial={initial} liveSync>
      {children}
    </PosProvider>
  );

  it("picks up a bill another terminal opened, without a reload", async () => {
    orderActions.fetchOpenOrders.mockResolvedValue([makeOrder({ id: "o-remote" })]);
    const { result } = renderHook(() => usePosState(), { wrapper });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ORDERS_POLL_MS);
    });

    expect(result.current.orders.map((order) => order.id)).toEqual(["o-remote"]);
  });

  it("drops a re-read that started before this terminal's own change, so it cannot undo it", async () => {
    let resolveFetch: (orders: Order[]) => void = () => undefined;
    orderActions.fetchOpenOrders.mockReturnValue(new Promise<Order[]>((resolve) => (resolveFetch = resolve)));
    orderActions.openOrderAction.mockResolvedValue(makeOrder({ id: "o-mine" }));
    const { result } = renderHook(() => ({ state: usePosState(), actions: usePosActions() }), { wrapper });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ORDERS_POLL_MS);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10);
      await result.current.actions.openOrder({ type: "takeaway", tableId: null, waiter: "a" });
    });
    await act(async () => {
      resolveFetch([]);
    });

    expect(result.current.state.orders.map((order) => order.id)).toEqual(["o-mine"]);
  });

  it("does not poll at all unless live sync is switched on", async () => {
    renderHook(() => usePosState(), { wrapper: ({ children }) => <PosProvider initial={initial}>{children}</PosProvider> });

    await act(async () => {
      await vi.advanceTimersByTimeAsync(ORDERS_POLL_MS * 3);
    });

    expect(orderActions.fetchOpenOrders).not.toHaveBeenCalled();
  });
});
