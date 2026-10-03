import { describe, expect, it } from "vitest";
import type { FloorAndOrders, TableDefinition } from "@/features/pos/model/pos-state";
import type { Order, OrderLine } from "@/features/pos/model/order";
import { hourLabel, openBillCount, tableOccupancy } from "@/features/pos/model/stats";
import { billLine as line } from "../../../support/pos-fixtures";

const NOW = new Date(2026, 8, 21, 20);

const baseOrder: Order = {
  id: "o",
  number: 1,
  type: "table",
  tableId: null,
  waiter: "ahmet",
  openedAt: NOW.toISOString(),
  stage: "preparing",
  status: "open",
  closedAt: null,
  lines: [],
  discountPercent: 0,
  payments: [],
};

describe("tableOccupancy", () => {
  const tables: readonly TableDefinition[] = [
    { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
    { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
    { id: "t3", name: "Masa 3", areaId: "a1", shape: "square" },
  ];
  const billOn = (tableId: string, lines: OrderLine[]): Order => ({ ...baseOrder, id: `bill-${tableId}`, tableId, lines });
  const state = (orders: Order[], tableList: readonly TableDefinition[] = tables): FloorAndOrders => ({ tables: tableList, orders });

  it("counts the tables that have something on their bill", () => {
    expect(tableOccupancy(state([billOn("t1", [line("a", 100)])]))).toEqual({ occupied: 1, free: 2, total: 3, percent: 33 });
  });

  it("treats a freshly opened, still empty bill as a free table", () => {
    expect(tableOccupancy(state([billOn("t1", [])]))).toMatchObject({ occupied: 0, free: 3, percent: 0 });
  });

  it("rounds the share to a whole percent", () => {
    expect(tableOccupancy(state([billOn("t1", [line("a", 100)]), billOn("t2", [line("a", 100)])]))).toMatchObject({ occupied: 2, percent: 67 });
  });

  it("is zero, not NaN, when no table is defined", () => {
    expect(tableOccupancy(state([], []))).toEqual({ occupied: 0, free: 0, total: 0, percent: 0 });
  });

  it("ignores takeaway and delivery orders, which never sit at a table", () => {
    const takeaway: Order = { ...billOn("t1", [line("a", 100)]), type: "takeaway", tableId: null };

    expect(tableOccupancy(state([takeaway])).occupied).toBe(0);
  });
});

describe("openBillCount", () => {
  const withLines = (id: string): Order => ({ ...baseOrder, id, lines: [line("a", 100)] });

  it("counts open bills that have something on them", () => {
    const empty: Order = { ...withLines("empty"), lines: [] };

    expect(openBillCount({ orders: [withLines("a"), withLines("b"), empty] })).toBe(2);
  });

  it("is zero when nothing is open", () => {
    expect(openBillCount({ orders: [] })).toBe(0);
  });
});

describe("hourLabel", () => {
  it("writes the hour as a clock time", () => {
    expect([hourLabel(0), hourLabel(9), hourLabel(16), hourLabel(23)]).toEqual(["00:00", "09:00", "16:00", "23:00"]);
  });
});
