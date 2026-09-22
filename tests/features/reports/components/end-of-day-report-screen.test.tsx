import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EndOfDayReportScreen } from "@/features/reports/components/end-of-day-report-screen";
import { useNow } from "@/features/pos/hooks/use-now";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { billLine, buildClosedOrder, buildPosState, localTime } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(localTime(20));
});

function setup() {
  const initial = {
    ...buildPosState(),
    history: [
      buildClosedOrder({ id: "h1", closedAt: localTime(15), lines: [billLine("a", 10000)] }),
      buildClosedOrder({
        id: "h2",
        closedAt: localTime(16),
        lines: [billLine("b", 8000)],
        payments: [],
        outcome: "cancelled" as const,
      }),
    ],
  };
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <EndOfDayReportScreen />
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
});
