import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestaurantStatisticsScreen } from "@/features/reports/components/restaurant-statistics-screen";
import { PosProvider } from "@/features/pos/store/pos-provider";
import { buildDaySummary, buildPosSnapshot } from "../../../support/pos-fixtures";

const DAY = buildDaySummary({ paidCount: 1, salesTotal: 10000, averageBill: 10000 });

function setup() {
  render(
    <PosProvider initial={buildPosSnapshot()}>
      <RestaurantStatisticsScreen day={DAY} />
    </PosProvider>
  );
  return userEvent.setup();
}

describe("RestaurantStatisticsScreen", () => {
  it("starts on Özet with real figures", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Restaurant İstatistikleri" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Bugünkü Ciro" })).toHaveTextContent("₺100,00");
    expect(screen.getByRole("group", { name: "Masa Doluluğu" })).toHaveTextContent("%33");
  });

  it("says the other dimensions have no data source in this demo", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Garson Bazlı Satışlar" }));

    expect(screen.getByText("Bu rapor için örnek veri bulunmuyor.")).toBeInTheDocument();
  });
});
