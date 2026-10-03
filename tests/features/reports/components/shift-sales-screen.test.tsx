import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftSalesScreen } from "@/features/reports/components/shift-sales-screen";
import { billLine, buildDaySummary } from "../../../support/pos-fixtures";
import { closedOrder } from "../../../support/report-fixtures";

const DAY = buildDaySummary({ paidCount: 1, salesTotal: 10000, byMethod: [{ method: "cash", amount: 10000, share: 100 }] });
const CLOSED_ORDERS = [
  closedOrder({ id: "h1", number: 1, status: "paid", lines: [billLine("a", 10000)] }),
  closedOrder({ id: "h2", number: 2, status: "cancelled", lines: [billLine("b", 5000)] }),
];

function setup() {
  render(<ShiftSalesScreen day={DAY} closedOrders={CLOSED_ORDERS} />);
  return userEvent.setup();
}

describe("ShiftSalesScreen", () => {
  it("starts on Ödeme Raporu with today's payment breakdown", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Vardiya Satış Raporu" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ödeme Raporu", selected: true })).toBeInTheDocument();
    expect(screen.getByText("Nakit")).toBeInTheDocument();
  });

  it("lists today's closed bills on Adisyon Raporu, paid and cancelled alike", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Adisyon Raporu" }));

    expect(screen.getByRole("row", { name: /#1/ })).toHaveTextContent("₺100,00");
    expect(screen.getByRole("row", { name: /#2/ })).toHaveTextContent("İptal");
  });

  it("says Kasa Raporu has no data source in this demo", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Kasa Raporu" }));

    expect(screen.getByText("Bu rapor için örnek veri bulunmuyor.")).toBeInTheDocument();
  });
});
