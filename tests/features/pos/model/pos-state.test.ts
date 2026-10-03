import { describe, expect, it } from "vitest";
import { isTableOccupied, openOrderTotal, orderForTable, orderTitle, type FloorAndOrders, type TableDefinition } from "@/features/pos/model/pos-state";
import type { Order } from "@/features/pos/model/order";
import { billLine, billPayment } from "../../../support/pos-fixtures";

const NOW = new Date("2026-09-21T12:00:00.000Z");

const tables: readonly TableDefinition[] = [
  { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
  { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
];

function order(overrides: Partial<Order> = {}): Order {
  return {
    id: "o1",
    number: 1,
    type: "table",
    tableId: "t1",
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

const state = (orders: Order[]): FloorAndOrders => ({ tables, orders });

describe("orderForTable", () => {
  it("finds the open order sitting at a table", () => {
    expect(orderForTable(state([order()]), "t1")?.id).toBe("o1");
  });

  it("is undefined for a free table", () => {
    expect(orderForTable(state([order()]), "t2")).toBeUndefined();
  });

  it("ignores takeaway and delivery orders, which have no table", () => {
    const takeaway = order({ type: "takeaway", tableId: null });

    expect(orderForTable(state([takeaway]), "t1")).toBeUndefined();
  });
});

describe("orderTitle", () => {
  it("names a table order after its table", () => {
    expect(orderTitle(state([]), order())).toBe("Masa 1");
  });

  it("uses a fixed name for takeaway and delivery orders", () => {
    expect(orderTitle(state([]), order({ type: "takeaway", tableId: null }))).toBe("Gel Al Sipariş");
    expect(orderTitle(state([]), order({ type: "delivery", tableId: null }))).toBe("Paket Sipariş");
  });

  it("falls back gracefully if the table was deleted", () => {
    expect(orderTitle({ tables: [], orders: [] }, order())).toBe("Silinmiş masa");
  });
});

describe("isTableOccupied", () => {
  it("is occupied only once something is on the bill", () => {
    const empty = order();
    const withLine = order({ lines: [billLine("a", 100)] });

    expect(isTableOccupied(state([empty]), "t1")).toBe(false);
    expect(isTableOccupied(state([withLine]), "t1")).toBe(true);
    expect(isTableOccupied(state([withLine]), "t2")).toBe(false);
  });
});

describe("openOrderTotal", () => {
  it("adds up what is still to be collected across open orders", () => {
    const first = order({ id: "o1", tableId: "t1", lines: [billLine("a", 5200, 2)] });
    const second = order({ id: "o2", tableId: "t2", lines: [billLine("b", 5200, 1)] });
    const partlyPaid = { ...first, payments: [billPayment("cash", 2000, NOW)] };

    expect(openOrderTotal({ orders: [first, second] })).toBe(15600);
    expect(openOrderTotal({ orders: [partlyPaid, second] })).toBe(13600);
    expect(openOrderTotal({ orders: [] })).toBe(0);
  });
});
