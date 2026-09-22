import { describe, expect, it } from "vitest";
import type { Order, OrderLine } from "@/features/pos/model/order";
import { createEmptyPosState, type ClosedOrder, type PosState } from "@/features/pos/model/pos-state";
import { hourLabel, openBillCount, productSalesToday, summarizeDay, tableOccupancy } from "@/features/pos/model/stats";
import { billLine as line, billPayment as pay, buildClosedOrder as closed, localTime } from "../../../support/pos-fixtures";

const at = localTime;
const NOW = at(20);

const stateWith = (history: ClosedOrder[], overrides: Partial<PosState> = {}): PosState => ({ ...createEmptyPosState(), history, ...overrides });

describe("summarizeDay", () => {
  it("is all zeros when nothing was sold today", () => {
    const summary = summarizeDay(createEmptyPosState(), NOW);

    expect(summary).toMatchObject({ paidCount: 0, cancelledCount: 0, cancelledTotal: 0, salesTotal: 0, averageBill: 0, byMethod: [], peakHour: null });
    expect(summary.byHour).toHaveLength(24);
    expect(summary.byHour.every((bucket) => bucket.amount === 0)).toBe(true);
  });

  it("adds up the bills that were paid today, discount included", () => {
    const state = stateWith([
      closed({ id: "o1", closedAt: at(15), lines: [line("a", 10000, 2)] }),
      closed({ id: "o2", closedAt: at(16), lines: [line("b", 20000)], discountPercent: 10 }),
    ]);

    const summary = summarizeDay(state, NOW);

    expect(summary.paidCount).toBe(2);
    expect(summary.salesTotal).toBe(20000 + 18000);
  });

  it("ignores bills closed on another day", () => {
    const state = stateWith([
      closed({ id: "yesterday", closedAt: at(23, 59, 20) }),
      closed({ id: "tomorrow", closedAt: at(0, 0, 22) }),
      closed({ id: "today", closedAt: at(0, 0, 21) }),
    ]);

    expect(summarizeDay(state, NOW).paidCount).toBe(1);
  });

  it("does not count a bill that is still open", () => {
    const open = closed({ id: "open", closedAt: at(18) }).order;

    expect(summarizeDay(stateWith([], { orders: [open] }), NOW).salesTotal).toBe(0);
  });

  it("counts cancelled bills apart from sales", () => {
    const state = stateWith([
      closed({ id: "o1", closedAt: at(15), lines: [line("a", 10000)] }),
      closed({ id: "o2", closedAt: at(16), lines: [line("b", 7500)], payments: [], outcome: "cancelled" }),
    ]);

    const summary = summarizeDay(state, NOW);

    expect(summary).toMatchObject({ paidCount: 1, salesTotal: 10000, cancelledCount: 1, cancelledTotal: 7500 });
    expect(summary.byHour.reduce((sum, bucket) => sum + bucket.amount, 0)).toBe(10000);
  });

  describe("average bill", () => {
    it("is the sales total over the paid bills, rounded to a whole kuruş", () => {
      const state = stateWith([
        closed({ id: "o1", closedAt: at(15), lines: [line("a", 10000)] }),
        closed({ id: "o2", closedAt: at(16), lines: [line("b", 10001)] }),
      ]);

      expect(summarizeDay(state, NOW).averageBill).toBe(10001);
    });
  });

  describe("by payment method", () => {
    it("groups what was collected per method, largest first", () => {
      const state = stateWith([
        closed({ id: "o1", closedAt: at(15), lines: [line("a", 10000)], payments: [pay("cash", 4000, at(15)), pay("card", 6000, at(15))] }),
        closed({ id: "o2", closedAt: at(16), lines: [line("b", 5000)], payments: [pay("card", 5000, at(16))] }),
      ]);

      expect(summarizeDay(state, NOW).byMethod).toEqual([
        { method: "card", amount: 11000, share: 73 },
        { method: "cash", amount: 4000, share: 27 },
      ]);
    });

    it("lists a bill left on account under its own method", () => {
      const state = stateWith([closed({ id: "o1", closedAt: at(15), lines: [line("a", 3000)], payments: [pay("on_account", 3000, at(15))] })]);

      expect(summarizeDay(state, NOW).byMethod).toEqual([{ method: "on_account", amount: 3000, share: 100 }]);
    });
  });

  describe("by hour", () => {
    it("puts each bill in the hour it was closed", () => {
      const state = stateWith([
        closed({ id: "o1", closedAt: at(15, 5), lines: [line("a", 4500)] }),
        closed({ id: "o2", closedAt: at(16, 10), lines: [line("b", 30000)] }),
        closed({ id: "o3", closedAt: at(16, 50), lines: [line("c", 6700)] }),
      ]);

      const { byHour } = summarizeDay(state, NOW);

      expect(byHour[15]).toEqual({ hour: 15, amount: 4500 });
      expect(byHour[16]).toEqual({ hour: 16, amount: 36700 });
      expect(byHour[17]).toEqual({ hour: 17, amount: 0 });
      expect(byHour.map((bucket) => bucket.hour)).toEqual(Array.from({ length: 24 }, (_, hour) => hour));
    });

    it("names the busiest hour, and the earliest one when two tie", () => {
      const busy = stateWith([
        closed({ id: "o1", closedAt: at(15), lines: [line("a", 4500)] }),
        closed({ id: "o2", closedAt: at(16), lines: [line("b", 36700)] }),
      ]);
      const tied = stateWith([
        closed({ id: "o1", closedAt: at(18), lines: [line("a", 5000)] }),
        closed({ id: "o2", closedAt: at(13), lines: [line("b", 5000)] }),
      ]);

      expect(summarizeDay(busy, NOW).peakHour).toEqual({ hour: 16, amount: 36700 });
      expect(summarizeDay(tied, NOW).peakHour?.hour).toBe(13);
    });
  });

  it("does not modify the state it reads", () => {
    const state = stateWith([closed({ id: "o1", closedAt: at(15) })]);
    const before = JSON.stringify(state);

    summarizeDay(state, NOW);

    expect(JSON.stringify(state)).toBe(before);
  });
});

describe("tableOccupancy", () => {
  const tables: PosState["tables"] = [
    { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
    { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
    { id: "t3", name: "Masa 3", areaId: "a1", shape: "square" },
  ];
  const billOn = (tableId: string, lines: OrderLine[]): Order => ({ ...closed({ closedAt: NOW, lines }).order, id: `bill-${tableId}`, tableId });

  it("counts the tables that have something on their bill", () => {
    const state = stateWith([], { tables, orders: [billOn("t1", [line("a", 100)])] });

    expect(tableOccupancy(state)).toEqual({ occupied: 1, free: 2, total: 3, percent: 33 });
  });

  it("treats a freshly opened, still empty bill as a free table", () => {
    const state = stateWith([], { tables, orders: [billOn("t1", [])] });

    expect(tableOccupancy(state)).toMatchObject({ occupied: 0, free: 3, percent: 0 });
  });

  it("rounds the share to a whole percent", () => {
    const state = stateWith([], { tables, orders: [billOn("t1", [line("a", 100)]), billOn("t2", [line("a", 100)])] });

    expect(tableOccupancy(state)).toMatchObject({ occupied: 2, percent: 67 });
  });

  it("is zero, not NaN, when no table is defined", () => {
    expect(tableOccupancy(createEmptyPosState())).toEqual({ occupied: 0, free: 0, total: 0, percent: 0 });
  });

  it("ignores takeaway and delivery orders, which never sit at a table", () => {
    const takeaway: Order = { ...billOn("t1", [line("a", 100)]), type: "takeaway", tableId: null };

    expect(tableOccupancy(stateWith([], { tables, orders: [takeaway] })).occupied).toBe(0);
  });
});

describe("openBillCount", () => {
  const withLines = (id: string): Order => ({ ...closed({ id, closedAt: NOW, lines: [line("a", 100)] }).order });

  it("counts open bills that have something on them", () => {
    const empty: Order = { ...withLines("empty"), lines: [] };
    const state = stateWith([], { orders: [withLines("a"), withLines("b"), empty] });

    expect(openBillCount(state)).toBe(2);
  });

  it("is zero when nothing is open", () => {
    expect(openBillCount(createEmptyPosState())).toBe(0);
  });
});

describe("hourLabel", () => {
  it("writes the hour as a clock time", () => {
    expect([hourLabel(0), hourLabel(9), hourLabel(16), hourLabel(23)]).toEqual(["00:00", "09:00", "16:00", "23:00"]);
  });
});

describe("productSalesToday", () => {
  const cay = (id: string, closedAt: Date, quantity = 1, isComplimentary = false): ReturnType<typeof closed> =>
    closed({
      id,
      closedAt,
      lines: [{ id: `${id}-l`, productId: "p-cay", name: "Çay", unitPrice: 5200, quantity, isComplimentary }],
    });

  it("adds up quantity and amount per product, largest amount first", () => {
    const state = stateWith([
      cay("o1", at(15), 2),
      closed({ id: "o2", closedAt: at(16), lines: [line("b", 19500)] }),
      cay("o3", at(17), 1),
    ]);

    const rows = productSalesToday(state, NOW);

    expect(rows[0]).toMatchObject({ productId: "p-b", name: "b", quantity: 1, amount: 19500 });
    expect(rows[1]).toMatchObject({ productId: "p-cay", name: "Çay", quantity: 3, amount: 15600 });
  });

  it("ignores cancelled bills and other days", () => {
    const state = stateWith([cay("cancelled", at(15), 1), cay("cancelled", at(15))]);
    const cancelledOnly = stateWith([{ ...cay("o1", at(15)), outcome: "cancelled" }, cay("o2", at(23, 59, 20))]);
    void state;

    expect(productSalesToday(cancelledOnly, NOW)).toEqual([]);
  });

  it("counts a complimentary line's quantity but not its amount", () => {
    const state = stateWith([cay("o1", at(15), 2, true)]);

    expect(productSalesToday(state, NOW)).toEqual([{ productId: "p-cay", name: "Çay", quantity: 2, amount: 0 }]);
  });

  it("is empty when nothing was sold today", () => {
    expect(productSalesToday(createEmptyPosState(), NOW)).toEqual([]);
  });
});
