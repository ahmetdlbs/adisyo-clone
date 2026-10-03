import { describe, expect, it } from "vitest";
import { toDaySummary, toProductSales } from "@/features/reports/server/adapt";
import type { ApiDaySummary, ApiProductSales } from "@/features/reports/server/wire-types";

describe("toDaySummary", () => {
  it("lower-cases each method and carries every figure through unchanged", () => {
    const api: ApiDaySummary = {
      paidCount: 2,
      salesTotal: 41200,
      averageBill: 20600,
      cancelledCount: 1,
      cancelledTotal: 8000,
      byMethod: [
        { method: "CARD", amount: 36700, share: 89 },
        { method: "SMART_TICKET", amount: 4500, share: 11 },
      ],
      byHour: [{ hour: 16, amount: 36700 }],
      peakHour: { hour: 16, amount: 36700 },
      expenseTotal: 5000,
      wastageTotal: 1200,
      costOfGoods: 9000,
      stockValue: 45000,
    };

    expect(toDaySummary(api)).toEqual({
      paidCount: 2,
      salesTotal: 41200,
      averageBill: 20600,
      cancelledCount: 1,
      cancelledTotal: 8000,
      byMethod: [
        { method: "card", amount: 36700, share: 89 },
        { method: "smart_ticket", amount: 4500, share: 11 },
      ],
      byHour: [{ hour: 16, amount: 36700 }],
      peakHour: { hour: 16, amount: 36700 },
      expenseTotal: 5000,
      wastageTotal: 1200,
      costOfGoods: 9000,
      stockValue: 45000,
    });
  });

  it("keeps a null peakHour null, rather than mapping over nothing", () => {
    const api: ApiDaySummary = {
      paidCount: 0,
      salesTotal: 0,
      averageBill: 0,
      cancelledCount: 0,
      cancelledTotal: 0,
      byMethod: [],
      byHour: [],
      peakHour: null,
      expenseTotal: 0,
      wastageTotal: 0,
      costOfGoods: 0,
      stockValue: 0,
    };

    expect(toDaySummary(api).peakHour).toBeNull();
  });
});

describe("toProductSales", () => {
  it("carries every figure through, including a null productId for a deleted product", () => {
    const api: ApiProductSales = { productId: null, name: "Silinmiş Ürün", quantity: 3, amount: 15600 };

    expect(toProductSales(api)).toEqual({ productId: null, name: "Silinmiş Ürün", quantity: 3, amount: 15600 });
  });
});
