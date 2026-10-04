import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StockProductQuantityScreen } from "@/features/reports/components/stock-product-quantity-screen";
import type { StockItem } from "@/features/stock/model/stock-item";

const item = (overrides: Partial<StockItem>): StockItem => ({ id: "s", name: "Dana", unitId: "u", unitName: "kg", quantity: 10, ...overrides });

const ITEMS = [
  item({ id: "1", name: "Dana", quantity: 10, criticalLevel: 2 }),
  item({ id: "2", name: "Tavuk", quantity: 1, criticalLevel: 3 }),
  item({ id: "3", name: "Yağ", quantity: -2, criticalLevel: 0 }),
];

describe("StockProductQuantityScreen", () => {
  it("lists every stock card with its quantity and flags the critical ones", () => {
    render(<StockProductQuantityScreen stockItems={ITEMS} />);

    expect(screen.getByText("Dana")).toBeInTheDocument();
    expect(screen.getByText("10 kg")).toBeInTheDocument();
    expect(screen.getByText("Düşük Stok")).toBeInTheDocument();
    expect(screen.getByText("Eksiye Düştü")).toBeInTheDocument();
    expect(screen.getByText(/2 tanesi kritik seviyede/)).toBeInTheDocument();
  });

  it("narrows to critical cards only on request", async () => {
    render(<StockProductQuantityScreen stockItems={ITEMS} />);

    await userEvent.click(screen.getByRole("button", { name: "Sadece kritik olanlar" }));

    expect(screen.queryByText("Dana")).not.toBeInTheDocument();
    expect(screen.getByText("Tavuk")).toBeInTheDocument();
  });

  it("filters by the search box", async () => {
    render(<StockProductQuantityScreen stockItems={ITEMS} />);

    await userEvent.type(screen.getByRole("searchbox", { name: "Stok kartı ara" }), "tav");

    expect(screen.getByText("Tavuk")).toBeInTheDocument();
    expect(screen.queryByText("Dana")).not.toBeInTheDocument();
  });

  it("shows an empty message when there is nothing to list", () => {
    render(<StockProductQuantityScreen stockItems={[]} />);

    expect(screen.getByText("Gösterilecek stok kartı yok.")).toBeInTheDocument();
  });
});
