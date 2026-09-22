import { describe, expect, it } from "vitest";
import {
  addProduct,
  applyPayment,
  canClose,
  decrementProduct,
  discountAmount,
  dispatchDelivery,
  elapsedLabel,
  isLate,
  isLineSettled,
  markReady,
  orderTotal,
  paidTotal,
  quantityOf,
  remaining,
  removeLine,
  resetOrder,
  selectionAmount,
  setDiscountPercent,
  subtotal,
  toggleComplimentary,
  type Order,
} from "@/features/pos/model/order";

const NOW = new Date("2026-09-21T12:00:00.000Z");
const minutesAgo = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000).toISOString();

const CAY = { id: "p-cay", name: "Çay", price: 5200 };
const KOLA = { id: "p-kola", name: "Coca Cola", price: 10500 };

let sequence = 0;
const newId = () => `id-${++sequence}`;

function blank(overrides: Partial<Order> = {}): Order {
  return {
    id: "o1",
    number: 1,
    type: "table",
    tableId: "t-1",
    waiter: "ahmet",
    openedAt: NOW.toISOString(),
    stage: "preparing",
    lines: [],
    discountPercent: 0,
    payments: [],
    ...overrides,
  };
}

/** An order with two lines: 1 × Çay (52,00) and 2 × Kola (210,00) = 262,00. */
function withLines(overrides: Partial<Order> = {}): Order {
  return addProduct(addProduct(addProduct(blank(overrides), CAY, "l-cay"), KOLA, "l-kola"), KOLA, "unused");
}

const pay = (order: Order, method: Parameters<typeof applyPayment>[1]["method"], tendered: number, lineIds: string[] = []) =>
  applyPayment(order, { method, tendered, lineIds }, { paymentId: newId(), now: NOW });

describe("adding and removing products", () => {
  it("adds a line with the product's price frozen at that moment", () => {
    const order = addProduct(blank(), CAY, "l1");

    expect(order.lines).toEqual([
      { id: "l1", productId: "p-cay", name: "Çay", unitPrice: 5200, quantity: 1, isComplimentary: false },
    ]);
  });

  it("raises the quantity when the same product is added again", () => {
    const order = addProduct(addProduct(blank(), CAY, "l1"), CAY, "l2");

    expect(order.lines).toHaveLength(1);
    expect(order.lines[0]?.quantity).toBe(2);
  });

  it("does not merge a normal addition into a complimentary line", () => {
    const comped = toggleComplimentary(addProduct(blank(), CAY, "l1"), "l1");

    const order = addProduct(comped, CAY, "l2");

    expect(order.lines.map((line) => [line.id, line.isComplimentary])).toEqual([
      ["l1", true],
      ["l2", false],
    ]);
  });

  it("lowers the quantity and drops the line at zero", () => {
    const two = addProduct(addProduct(blank(), CAY, "l1"), CAY, "l2");

    const one = decrementProduct(two, "p-cay");
    const none = decrementProduct(one, "p-cay");

    expect(one.lines[0]?.quantity).toBe(1);
    expect(none.lines).toEqual([]);
  });

  it("ignores a decrement for a product that is not on the order", () => {
    const order = addProduct(blank(), CAY, "l1");

    expect(decrementProduct(order, "p-yok")).toEqual(order);
  });

  it("removes a line", () => {
    expect(removeLine(withLines(), "l-cay").lines.map((line) => line.id)).toEqual(["l-kola"]);
  });

  it("makes a line free when it is marked complimentary, and back", () => {
    const order = withLines();

    const comped = toggleComplimentary(order, "l-kola");
    expect(subtotal(comped)).toBe(5200);

    expect(subtotal(toggleComplimentary(comped, "l-kola"))).toBe(subtotal(order));
  });

  it("never mutates the order it was given", () => {
    const order = withLines();
    const snapshot = structuredClone(order);

    addProduct(order, CAY, "x");
    decrementProduct(order, "p-kola");
    removeLine(order, "l-cay");
    toggleComplimentary(order, "l-cay");

    expect(order).toEqual(snapshot);
  });

  it("refuses to change a line that has already been paid for", () => {
    const { order } = pay(withLines(), "cash", 5200, ["l-cay"]);

    expect(isLineSettled(order, "l-cay")).toBe(true);
    expect(() => removeLine(order, "l-cay")).toThrow("Ödenmiş kalem değiştirilemez");
    expect(() => decrementProduct(order, "p-cay")).toThrow("Ödenmiş kalem değiştirilemez");
    expect(() => toggleComplimentary(order, "l-cay")).toThrow("Ödenmiş kalem değiştirilemez");
  });
});

describe("quantityOf", () => {
  it("counts how many of a product are on the bill", () => {
    expect(quantityOf(withLines(), "p-kola")).toBe(2);
    expect(quantityOf(withLines(), "p-yok")).toBe(0);
  });

  it("adds up a product's separate lines, e.g. a paid one and a new one", () => {
    const { order: paid } = pay(withLines(), "cash", 5200, ["l-cay"]);
    const order = addProduct(paid, CAY, "l-cay-2");

    expect(order.lines.filter((line) => line.productId === "p-cay")).toHaveLength(2);
    expect(quantityOf(order, "p-cay")).toBe(2);
  });

  it("does not count complimentary portions, which are shown separately", () => {
    expect(quantityOf(toggleComplimentary(withLines(), "l-kola"), "p-kola")).toBe(0);
  });
});

describe("resetOrder", () => {
  it("clears the bill", () => {
    expect(resetOrder(withLines()).lines).toEqual([]);
  });

  it("keeps lines that were already paid for", () => {
    const { order } = pay(withLines(), "cash", 5200, ["l-cay"]);

    expect(resetOrder(order).lines.map((line) => line.id)).toEqual(["l-cay"]);
  });

  it("keeps the payments and the discount", () => {
    const { order } = pay(setDiscountPercent(withLines(), 10), "cash", 4680, ["l-cay"]);

    const reset = resetOrder(order);

    expect(reset.payments).toEqual(order.payments);
    expect(reset.discountPercent).toBe(10);
  });
});

describe("totals", () => {
  it("sums quantity × price, skipping complimentary lines", () => {
    expect(subtotal(withLines())).toBe(26200);
    expect(subtotal(toggleComplimentary(withLines(), "l-cay"))).toBe(21000);
  });

  it("takes the discount off the subtotal, rounding half a kuruş up", () => {
    const order = setDiscountPercent(withLines(), 10);

    expect(discountAmount(order)).toBe(2620);
    expect(orderTotal(order)).toBe(23580);
  });

  it("is zero for an empty order", () => {
    expect(orderTotal(blank())).toBe(0);
    expect(remaining(blank())).toBe(0);
  });

  it("subtracts what was already paid, and never goes negative", () => {
    const { order } = pay(withLines(), "card", 10000);

    expect(paidTotal(order)).toBe(10000);
    expect(remaining(order)).toBe(16200);
    expect(remaining(setDiscountPercent(blank(), 0))).toBe(0);
  });
});

describe("setDiscountPercent", () => {
  it.each([0, 10, 12.5, 100])("accepts %s%%", (percent) => {
    expect(setDiscountPercent(withLines(), percent).discountPercent).toBe(percent);
  });

  it.each([-1, -50, 100.01, 150, Number.NaN, Number.POSITIVE_INFINITY])("rejects %s%%", (percent) => {
    expect(() => setDiscountPercent(withLines(), percent)).toThrow(RangeError);
  });

  it("cannot push the total below what has already been collected", () => {
    const { order } = pay(withLines(), "cash", 20000);

    expect(() => setDiscountPercent(order, 50)).toThrow("İndirim, tahsil edilen tutarın altına düşemez");
  });
});

describe("applyPayment", () => {
  it("records a partial payment and keeps the balance open", () => {
    const { order, change } = pay(withLines(), "card", 10000);

    expect(order.payments).toEqual([
      { id: expect.any(String), method: "card", amount: 10000, paidAt: NOW.toISOString(), lineIds: [] },
    ]);
    expect(remaining(order)).toBe(16200);
    expect(change).toBe(0);
    expect(canClose(order)).toBe(false);
  });

  it("closes the balance when the whole amount is paid", () => {
    const { order } = pay(withLines(), "cash", 26200);

    expect(remaining(order)).toBe(0);
    expect(canClose(order)).toBe(true);
  });

  it("gives change for cash handed over above the amount due, recording only what was due", () => {
    const { order, change } = pay(withLines(), "cash", 30000);

    expect(order.payments[0]?.amount).toBe(26200);
    expect(change).toBe(3800);
  });

  it.each(["card", "multinet", "on_account"] as const)("does not let %s pay more than is due", (method) => {
    expect(() => pay(withLines(), method, 30000)).toThrow(RangeError);
  });

  it("keeps the method it was paid with, so reports can tell them apart", () => {
    const first = pay(withLines(), "cash", 10000).order;
    const second = pay(first, "on_account", 16200).order;

    expect(second.payments.map((payment) => payment.method)).toEqual(["cash", "on_account"]);
  });

  it.each([0, -100, 12.5, Number.NaN])("rejects a tendered amount of %s", (tendered) => {
    expect(() => pay(withLines(), "cash", tendered)).toThrow(RangeError);
  });

  it("rejects paying an order that has nothing due", () => {
    expect(() => pay(blank(), "cash", 100)).toThrow("Ödenecek tutar yok");
  });

  it("remembers which lines a payment settled", () => {
    const { order } = pay(withLines(), "cash", 5200, ["l-cay"]);

    expect(isLineSettled(order, "l-cay")).toBe(true);
    expect(isLineSettled(order, "l-kola")).toBe(false);
  });

  it("never mutates the order it was given", () => {
    const order = withLines();
    const snapshot = structuredClone(order);

    pay(order, "cash", 5200, ["l-cay"]);

    expect(order).toEqual(snapshot);
  });

  it("lets an empty or all-complimentary order be closed without payment", () => {
    expect(canClose(blank())).toBe(true);
    expect(canClose(toggleComplimentary(addProduct(blank(), CAY, "l1"), "l1"))).toBe(true);
  });
});

describe("selectionAmount", () => {
  it("adds up the chosen lines with the order discount applied", () => {
    const order = setDiscountPercent(withLines(), 10);

    expect(selectionAmount(order, ["l-cay"])).toBe(5200 - 520);
    expect(selectionAmount(order, ["l-cay", "l-kola"])).toBe(5200 - 520 + 21000 - 2100);
  });

  it("skips lines that are already paid and ids that do not exist", () => {
    const { order } = pay(withLines(), "cash", 5200, ["l-cay"]);

    expect(selectionAmount(order, ["l-cay", "nope"])).toBe(0);
  });

  it("never asks for more than is still due", () => {
    const { order } = pay(withLines(), "card", 25000);

    expect(selectionAmount(order, ["l-kola"])).toBe(1200);
  });

  it("skips complimentary lines", () => {
    expect(selectionAmount(toggleComplimentary(withLines(), "l-cay"), ["l-cay"])).toBe(0);
  });
});

describe("kitchen stage", () => {
  it("moves a preparing order to ready", () => {
    expect(markReady(blank()).stage).toBe("ready");
  });

  it("only a preparing order can be marked ready", () => {
    expect(() => markReady(blank({ stage: "ready" }))).toThrow("Sipariş hazırlanıyor durumunda değil");
  });

  it("sends a ready delivery order out for delivery", () => {
    expect(dispatchDelivery(blank({ type: "delivery", tableId: null, stage: "ready" })).stage).toBe("out_for_delivery");
  });

  it("refuses to dispatch a table order or one that is not ready", () => {
    expect(() => dispatchDelivery(blank({ stage: "ready" }))).toThrow("Yalnızca paket sipariş teslimata çıkabilir");
    expect(() => dispatchDelivery(blank({ type: "delivery", tableId: null }))).toThrow("Sipariş hazır değil");
  });

  it("calls a preparing order late after 15 minutes", () => {
    expect(isLate(blank({ openedAt: minutesAgo(16) }), NOW)).toBe(true);
    expect(isLate(blank({ openedAt: minutesAgo(14) }), NOW)).toBe(false);
  });

  it("does not call a ready order late", () => {
    expect(isLate(blank({ openedAt: minutesAgo(60), stage: "ready" }), NOW)).toBe(false);
  });
});

describe("elapsedLabel", () => {
  it.each([
    [0, "0 dk"],
    [0.5, "0 dk"],
    [5, "5 dk"],
    [59, "59 dk"],
    [60, "1 s 00 dk"],
    [65, "1 s 05 dk"],
    [260, "4 s 20 dk"],
  ])("shows %s minutes as %j", (minutes, label) => {
    expect(elapsedLabel(minutesAgo(minutes), NOW)).toBe(label);
  });

  it("never shows a negative time when the clock is behind", () => {
    expect(elapsedLabel(new Date(NOW.getTime() + 60_000).toISOString(), NOW)).toBe("0 dk");
  });
});
