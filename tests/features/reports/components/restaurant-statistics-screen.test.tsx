import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestaurantStatisticsScreen } from "@/features/reports/components/restaurant-statistics-screen";
import { useNow } from "@/features/pos/hooks/use-now";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { billLine, buildClosedOrder, buildPosState, localTime } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(localTime(20));
});

function setup() {
  const initial = { ...buildPosState(), history: [buildClosedOrder({ id: "h1", closedAt: localTime(15), lines: [billLine("a", 10000)] })] };
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <RestaurantStatisticsScreen />
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
