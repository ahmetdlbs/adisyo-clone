import { describe, expect, it } from "vitest";
import { wastageByProduct, type Wastage } from "@/features/wastage/model/wastage";

const wastage = (overrides: Partial<Wastage>): Wastage => ({
  id: "w",
  productName: "Dana",
  reason: "Bozuldu",
  quantity: 1,
  cost: 1000,
  occurredAt: "2026-01-01T10:00:00Z",
  responsible: "Ayşe",
  ...overrides,
});

describe("wastageByProduct", () => {
  it("returns nothing for no records", () => {
    expect(wastageByProduct([])).toEqual([]);
  });

  it("sums count, quantity and cost per product", () => {
    const rows = wastageByProduct([wastage({ quantity: 2, cost: 500 }), wastage({ quantity: 1.5, cost: 700 }), wastage({ productName: "Çay", cost: 100 })]);

    expect(rows).toEqual([
      { productName: "Dana", count: 2, quantity: 3.5, cost: 1200 },
      { productName: "Çay", count: 1, quantity: 1, cost: 100 },
    ]);
  });

  it("orders by cost, then name", () => {
    const rows = wastageByProduct([wastage({ productName: "Zeytin", cost: 300 }), wastage({ productName: "Ayran", cost: 300 }), wastage({ productName: "Et", cost: 900 })]);

    expect(rows.map((row) => row.productName)).toEqual(["Et", "Ayran", "Zeytin"]);
  });
});
