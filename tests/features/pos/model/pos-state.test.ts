import { describe, expect, it } from "vitest";
import { addProduct, applyPayment, toggleComplimentary } from "@/features/pos/model/order";
import {
  cancelOrder,
  closeOrder,
  createEmptyPosState,
  createOrder,
  discardEmptyOrder,
  isTableOccupied,
  moveOrderToTable,
  openOrderTotal,
  orderForTable,
  orderTitle,
  updateOrder,
  type PosState,
} from "@/features/pos/model/pos-state";

const NOW = new Date("2026-09-21T12:00:00.000Z");
const CAY = { id: "p-cay", name: "Çay", price: 5200 };

const base = (): PosState => ({
  ...createEmptyPosState(),
  areas: [{ id: "a1", name: "Salon" }],
  tables: [
    { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
    { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
  ],
});

const open = (state: PosState, overrides: Partial<Parameters<typeof createOrder>[1]> = {}) =>
  createOrder(state, { id: "o1", type: "table", tableId: "t1", waiter: "ahmet", now: NOW, ...overrides });

const withCay = (state: PosState, orderId = "o1") => updateOrder(state, orderId, (order) => addProduct(order, CAY, "l1"));

describe("createOrder", () => {
  it("opens an order with the next adisyon number", () => {
    const first = open(base());
    const second = open(first, { id: "o2", tableId: "t2" });

    expect(first.orders[0]).toMatchObject({ id: "o1", number: 1, type: "table", tableId: "t1", stage: "preparing", waiter: "ahmet" });
    expect(second.orders.map((order) => order.number)).toEqual([1, 2]);
    expect(second.nextOrderNumber).toBe(3);
  });

  it("stamps the time it was opened", () => {
    expect(open(base()).orders[0]?.openedAt).toBe(NOW.toISOString());
  });

  it("opens takeaway and delivery orders without a table", () => {
    const state = open(base(), { type: "takeaway", tableId: null, customerName: "Ahmet" });

    expect(state.orders[0]).toMatchObject({ type: "takeaway", tableId: null, customerName: "Ahmet" });
  });

  it("does not open a second order on a table that already has one", () => {
    expect(() => open(open(base()), { id: "o2" })).toThrow("Bu masada açık sipariş var");
  });

  it("rejects a table that does not exist", () => {
    expect(() => open(base(), { tableId: "t99" })).toThrow("Masa bulunamadı");
  });

  it("needs a table for a table order", () => {
    expect(() => open(base(), { tableId: null })).toThrow("Masa siparişi için masa gerekli");
  });

  it("does not mutate the state it was given", () => {
    const state = base();
    const snapshot = structuredClone(state);

    open(state);

    expect(state).toEqual(snapshot);
  });
});

describe("orderTitle", () => {
  it("names a table order after its table", () => {
    const state = open(base());

    expect(orderTitle(state, state.orders[0]!)).toBe("Masa 1");
  });

  it("uses a fixed name for takeaway and delivery orders", () => {
    const takeaway = open(base(), { type: "takeaway", tableId: null });
    const delivery = open(base(), { id: "o2", type: "delivery", tableId: null });

    expect(orderTitle(takeaway, takeaway.orders[0]!)).toBe("Gel Al Sipariş");
    expect(orderTitle(delivery, delivery.orders[0]!)).toBe("Paket Sipariş");
  });

  it("falls back gracefully if the table was deleted", () => {
    const state = open(base());

    expect(orderTitle({ ...state, tables: [] }, state.orders[0]!)).toBe("Silinmiş masa");
  });
});

describe("table occupancy", () => {
  it("is occupied only once something is on the bill", () => {
    const opened = open(base());

    expect(isTableOccupied(opened, "t1")).toBe(false);
    expect(isTableOccupied(withCay(opened), "t1")).toBe(true);
    expect(isTableOccupied(withCay(opened), "t2")).toBe(false);
  });

  it("finds the order of a table", () => {
    expect(orderForTable(open(base()), "t1")?.id).toBe("o1");
    expect(orderForTable(open(base()), "t2")).toBeUndefined();
  });
});

describe("updateOrder", () => {
  it("applies the change to that order only", () => {
    const state = withCay(open(open(base()), { id: "o2", tableId: "t2" }));

    expect(state.orders.find((order) => order.id === "o1")?.lines).toHaveLength(1);
    expect(state.orders.find((order) => order.id === "o2")?.lines).toHaveLength(0);
  });

  it("keeps the order when its last item is taken off, so the bill can be refilled without it vanishing", () => {
    const state = updateOrder(withCay(open(base())), "o1", (order) => ({ ...order, lines: [] }));

    expect(state.orders).toHaveLength(1);
    expect(isTableOccupied(state, "t1")).toBe(false);
  });

  it("keeps an empty takeaway order open while it is being taken", () => {
    const state = open(base(), { type: "takeaway", tableId: null });

    expect(updateOrder(state, "o1", (order) => order).orders).toHaveLength(1);
  });

  it("rejects an unknown order", () => {
    expect(() => updateOrder(base(), "nope", (order) => order)).toThrow("Sipariş bulunamadı");
  });
});

describe("closeOrder", () => {
  const paidInFull = () =>
    updateOrder(withCay(open(base())), "o1", (order) =>
      applyPayment(order, { method: "cash", tendered: 5200 }, { paymentId: "p1", now: NOW }).order
    );

  it("moves a fully paid order to the history and frees the table", () => {
    const closedAt = new Date(NOW.getTime() + 60_000);

    const state = closeOrder(paidInFull(), "o1", closedAt);

    expect(state.orders).toEqual([]);
    expect(state.history).toHaveLength(1);
    expect(state.history[0]).toMatchObject({ outcome: "paid", closedAt: closedAt.toISOString() });
    expect(state.history[0]?.order.id).toBe("o1");
  });

  it("refuses to close an order that still has an amount due", () => {
    expect(() => closeOrder(withCay(open(base())), "o1", NOW)).toThrow("Ödenecek tutar var");
  });

  it("closes an order that is free of charge without a payment", () => {
    const comped = updateOrder(withCay(open(base())), "o1", (order) => toggleComplimentary(order, "l1"));

    expect(closeOrder(comped, "o1", NOW).history).toHaveLength(1);
  });
});

describe("cancelOrder", () => {
  it("keeps a record of the cancelled order instead of erasing it", () => {
    const state = cancelOrder(withCay(open(base())), "o1", NOW);

    expect(state.orders).toEqual([]);
    expect(state.history[0]).toMatchObject({ outcome: "cancelled", closedAt: NOW.toISOString() });
    expect(state.history[0]?.order.lines).toHaveLength(1);
  });
});

describe("discardEmptyOrder", () => {
  it("drops an order nothing was ever added to", () => {
    const state = open(base(), { type: "delivery", tableId: null });

    expect(discardEmptyOrder(state, "o1").orders).toEqual([]);
    expect(discardEmptyOrder(state, "o1").history).toEqual([]);
  });

  it("leaves an order that has items", () => {
    const state = withCay(open(base(), { type: "delivery", tableId: null }));

    expect(discardEmptyOrder(state, "o1").orders).toHaveLength(1);
  });

  it("frees a table whose bill was emptied", () => {
    const emptied = updateOrder(withCay(open(base())), "o1", (order) => ({ ...order, lines: [] }));

    expect(discardEmptyOrder(emptied, "o1").orders).toEqual([]);
    expect(orderForTable(discardEmptyOrder(emptied, "o1"), "t1")).toBeUndefined();
  });

  it("never discards an order that has payments on record, even with no items left", () => {
    const paid = updateOrder(withCay(open(base())), "o1", (order) =>
      applyPayment(order, { method: "cash", tendered: 1000 }, { paymentId: "p1", now: NOW }).order
    );
    const emptied = updateOrder(paid, "o1", (order) => ({ ...order, lines: [] }));

    expect(discardEmptyOrder(emptied, "o1").orders).toHaveLength(1);
  });
});

describe("moveOrderToTable", () => {
  it("moves the bill to a free table", () => {
    const state = moveOrderToTable(withCay(open(base())), "o1", "t2");

    expect(orderForTable(state, "t2")?.id).toBe("o1");
    expect(orderForTable(state, "t1")).toBeUndefined();
  });

  it("refuses a table that is taken", () => {
    const state = withCay(open(withCay(open(base()), "o1"), { id: "o2", tableId: "t2" }), "o2");

    expect(() => moveOrderToTable(state, "o1", "t2")).toThrow("Hedef masada açık sipariş var");
  });

  it("refuses an unknown table and orders that are not table orders", () => {
    expect(() => moveOrderToTable(withCay(open(base())), "o1", "t99")).toThrow("Masa bulunamadı");
    const takeaway = open(base(), { type: "takeaway", tableId: null });
    expect(() => moveOrderToTable(takeaway, "o1", "t2")).toThrow("Yalnızca masa siparişi taşınabilir");
  });
});

describe("openOrderTotal", () => {
  it("adds up what is still to be collected across open orders", () => {
    const two = withCay(open(withCay(open(base())), { id: "o2", tableId: "t2" }), "o2");
    const partlyPaid = updateOrder(two, "o1", (order) =>
      applyPayment(order, { method: "cash", tendered: 2000 }, { paymentId: "p1", now: NOW }).order
    );

    expect(openOrderTotal(two)).toBe(10400);
    expect(openOrderTotal(partlyPaid)).toBe(8400);
    expect(openOrderTotal(base())).toBe(0);
  });
});
