import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ShiftSalesScreen } from "@/features/reports/components/shift-sales-screen";
import { useNow } from "@/features/pos/hooks/use-now";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { billLine, buildClosedOrder, buildPosState, localTime } from "../../../support/pos-fixtures";

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

beforeEach(() => {
  vi.mocked(useNow).mockReturnValue(localTime(20));
});

function setup() {
  const paid = buildClosedOrder({ id: "h1", closedAt: localTime(15), lines: [billLine("a", 10000)] });
  const cancelled = buildClosedOrder({ id: "h2", closedAt: localTime(16), lines: [billLine("b", 5000)], payments: [], outcome: "cancelled" as const });
  const initial = {
    ...buildPosState(),
    history: [paid, { ...cancelled, order: { ...cancelled.order, number: 2 } }],
  };
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <ShiftSalesScreen />
    </PosProvider>
  );
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
