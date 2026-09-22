import { describe, expect, it } from "vitest";
import { createSeedState } from "@/features/pos/data/pos-seed";
import { createEmptyPosState } from "@/features/pos/model/pos-state";
import { parsePosState } from "@/features/pos/store/pos-schema";

const NOW = new Date("2026-09-21T12:00:00.000Z");

describe("createSeedState", () => {
  it("offers a floor plan, a menu and a couple of open orders to start from", () => {
    const seed = createSeedState(NOW);

    expect(seed.areas.map((area) => area.name)).toEqual(["Salon", "bölge 2"]);
    expect(seed.tables).toHaveLength(15);
    expect(seed.products.length).toBeGreaterThan(20);
    expect(seed.orders.map((order) => order.type)).toEqual(["table", "takeaway"]);
    expect(seed.nextOrderNumber).toBe(203);
  });

  it("comes with today's trading already in history, so the dashboard and reports are never empty", () => {
    const seed = createSeedState(NOW);

    expect(seed.history.length).toBeGreaterThan(5);
    expect(seed.history.some((entry) => entry.outcome === "cancelled")).toBe(true);
    expect(
      seed.history.every((entry) => {
        const closed = new Date(entry.closedAt);
        return closed.getFullYear() === NOW.getFullYear() && closed.getMonth() === NOW.getMonth() && closed.getDate() === NOW.getDate();
      })
    ).toBe(true);
    expect(seed.history.every((entry) => entry.outcome !== "paid" || entry.order.payments.length > 0)).toBe(true);
  });

  it("keeps every product in a category and every table in an area", () => {
    const seed = createSeedState(NOW);

    expect(seed.products.every((product) => seed.categories.some((category) => category.id === product.categoryId))).toBe(true);
    expect(seed.tables.every((table) => seed.areas.some((area) => area.id === table.areaId))).toBe(true);
  });

  it("stores prices as whole kuruş", () => {
    expect(createSeedState(NOW).products.every((product) => Number.isInteger(product.price) && product.price > 0)).toBe(true);
  });
});

describe("parsePosState", () => {
  it("accepts what it wrote out, unchanged", () => {
    const seed = createSeedState(NOW);

    expect(parsePosState(JSON.parse(JSON.stringify(seed)))).toEqual(seed);
  });

  it("accepts an empty state", () => {
    expect(parsePosState(createEmptyPosState())).toEqual(createEmptyPosState());
  });

  it.each([
    ["null", null],
    ["a string", "state"],
    ["an empty object", {}],
    ["a missing list", { ...createEmptyPosState(), orders: undefined }],
  ])("rejects %s", (_label, value) => {
    expect(parsePosState(value)).toBeNull();
  });

  it("rejects a price that is not a whole number of kuruş", () => {
    const seed = createSeedState(NOW);
    const broken = { ...seed, products: [{ ...seed.products[0], price: 12.5 }] };

    expect(parsePosState(broken)).toBeNull();
  });

  it("rejects an order with an unknown payment method", () => {
    const seed = createSeedState(NOW);
    const [first] = seed.orders;
    const payment = { id: "p", method: "bitcoin", amount: 100, paidAt: NOW.toISOString(), lineIds: [] };
    const broken = { ...seed, orders: [{ ...first, payments: [payment] }] };

    expect(parsePosState(broken)).toBeNull();
  });

  it("rejects a discount outside 0–100", () => {
    const seed = createSeedState(NOW);
    const broken = { ...seed, orders: [{ ...seed.orders[0], discountPercent: 150 }] };

    expect(parsePosState(broken)).toBeNull();
  });
});
