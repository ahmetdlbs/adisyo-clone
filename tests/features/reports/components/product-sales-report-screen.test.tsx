import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductSalesReportScreen } from "@/features/reports/components/product-sales-report-screen";
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
    history: [buildClosedOrder({ id: "h1", closedAt: localTime(15), lines: [billLine("p-cay", 5200, 3)] })],
  };
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <ProductSalesReportScreen />
    </PosProvider>
  );
  return userEvent.setup();
}

describe("ProductSalesReportScreen", () => {
  it("starts on Ürün Bazında with real sales for today, and a total row", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Ürün Satış Raporu" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ürün Bazında", selected: true })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /p-cay/ })).toHaveTextContent("3");
    expect(screen.getByRole("row", { name: /p-cay/ })).toHaveTextContent("₺156,00");
    expect(screen.getByRole("row", { name: "Toplam" })).toHaveTextContent("₺156,00");
  });

  it("says a report dimension nothing tracks yet has no data, honestly", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Bölge Bazında" }));

    expect(screen.getByText("Bu rapor için örnek veri bulunmuyor.")).toBeInTheDocument();
  });
});
