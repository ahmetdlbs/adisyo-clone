// @vitest-environment node
import { describe, expect, it } from "vitest";
import { vi } from "vitest";
import { fetchClosedOrders, fetchDaySummary, fetchProductSales } from "@/features/reports/server/actions";
import { ApiError } from "@/lib/api-client";

const mocks = vi.hoisted(() => ({ apiFetch: vi.fn() }));
vi.mock("@/lib/api-client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api-client")>();
  return { ...actual, apiFetch: mocks.apiFetch };
});

const EMPTY_DAY = {
  paidCount: 0,
  salesTotal: 0,
  averageBill: 0,
  cancelledCount: 0,
  cancelledTotal: 0,
  byMethod: [],
  byHour: [],
  peakHour: null,
};

describe("fetchDaySummary", () => {
  it("reads /reports/day-summary and adapts the result", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue({ ...EMPTY_DAY, paidCount: 1, byMethod: [{ method: "CASH", amount: 100, share: 100 }] });

    const day = await fetchDaySummary();

    expect(mocks.apiFetch).toHaveBeenCalledWith("/reports/day-summary");
    expect(day.paidCount).toBe(1);
    expect(day.byMethod).toEqual([{ method: "cash", amount: 100, share: 100 }]);
  });

  it("passes a given date on as a query string", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue(EMPTY_DAY);

    await fetchDaySummary("2026-01-15T00:00:00.000Z");

    expect(mocks.apiFetch).toHaveBeenCalledWith("/reports/day-summary?date=2026-01-15T00%3A00%3A00.000Z");
  });

  it("throws the API's own message on failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new ApiError("Geçerli bir tarih giriniz", 400));

    await expect(fetchDaySummary("bad")).rejects.toThrow("Geçerli bir tarih giriniz");
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchDaySummary()).rejects.toThrow("Gün özeti alınamadı");
  });
});

describe("fetchProductSales", () => {
  it("reads /reports/product-sales and adapts every row", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue([{ productId: "p1", name: "Çay", quantity: 2, amount: 10400 }]);

    const rows = await fetchProductSales();

    expect(mocks.apiFetch).toHaveBeenCalledWith("/reports/product-sales");
    expect(rows).toEqual([{ productId: "p1", name: "Çay", quantity: 2, amount: 10400 }]);
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchProductSales()).rejects.toThrow("Ürün satışları alınamadı");
  });
});

describe("fetchClosedOrders", () => {
  it("reads /reports/closed-orders and adapts every order", async () => {
    mocks.apiFetch.mockReset().mockResolvedValue([
      {
        id: "o1",
        number: 1,
        type: "TABLE",
        tableId: "t1",
        customerName: null,
        waiter: "ahmet",
        openedAt: "2026-09-21T12:00:00.000Z",
        stage: "PREPARING",
        status: "PAID",
        discountPercent: 0,
        closedAt: "2026-09-21T13:00:00.000Z",
        lines: [],
        payments: [],
      },
    ]);

    const orders = await fetchClosedOrders();

    expect(mocks.apiFetch).toHaveBeenCalledWith("/reports/closed-orders");
    expect(orders[0]).toMatchObject({ id: "o1", status: "paid", closedAt: "2026-09-21T13:00:00.000Z" });
  });

  it("falls back to a generic message for a non-ApiError failure", async () => {
    mocks.apiFetch.mockReset().mockRejectedValue(new TypeError("fetch failed"));

    await expect(fetchClosedOrders()).rejects.toThrow("Kapanan adisyonlar alınamadı");
  });
});
