import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EndOfDayReportScreen } from "@/features/reports/components/end-of-day-report-screen";
import { PosProvider } from "@/features/pos/store/pos-provider";
import { buildDaySummary, buildPosSnapshot } from "../../../support/pos-fixtures";
import { closedOrder } from "../../../support/report-fixtures";

const DAY = buildDaySummary({
  paidCount: 1,
  salesTotal: 10000,
  averageBill: 10000,
  cancelledCount: 1,
  cancelledTotal: 8000,
  byMethod: [{ method: "cash", amount: 10000, share: 100 }],
});

const CLOSED_ORDERS = [closedOrder({ id: "h1", status: "paid" }), closedOrder({ id: "h2", status: "cancelled" })];

function setup() {
  render(
    <PosProvider initial={buildPosSnapshot()}>
      <EndOfDayReportScreen day={DAY} closedOrders={CLOSED_ORDERS} />
    </PosProvider>
  );
  return userEvent.setup();
}

describe("EndOfDayReportScreen", () => {
  it("has a heading and starts on the Özet tab with real figures from today", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Gün Sonu Raporu" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Özet", selected: true })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Bugünkü Ciro" })).toHaveTextContent("₺100,00");
    expect(screen.getByRole("group", { name: "İptal Edilen Adisyon" })).toHaveTextContent("1");
    expect(screen.getByRole("group", { name: "Tahsil Edilmemiş Tutar" })).toHaveTextContent("₺209,00");
  });

  it("lists every report as a tab", () => {
    setup();

    expect(screen.getByRole("tab", { name: "Tüm Adisyonlar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Garson Bazlı Satışlar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Silinen Tahsilatlar" })).toBeInTheDocument();
  });

  it("says a report with no data source in this demo has none, honestly, instead of fake zeros", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Garson Bazlı Satışlar" }));

    expect(screen.getByText("Bu rapor için örnek veri bulunmuyor.")).toBeInTheDocument();
  });

  it("shows the payment breakdown of the day on the Özet tab", () => {
    setup();

    const payments = within(screen.getByRole("region", { name: "Alınan Ödemeler" }));
    expect(payments.getByText("Nakit")).toBeInTheDocument();
  });

  it("lists every closed order, paid and cancelled, on the Tüm Adisyonlar tab", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Tüm Adisyonlar" }));

    const rows = screen.getAllByRole("row");
    expect(within(rows[1]!).getByText("Ödendi")).toBeInTheDocument();
    expect(within(rows[2]!).getByText("İptal")).toBeInTheDocument();
  });
});
