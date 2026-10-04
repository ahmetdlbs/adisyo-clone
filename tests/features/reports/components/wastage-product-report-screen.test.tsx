import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WastageProductReportScreen } from "@/features/reports/components/wastage-product-report-screen";
import type { Wastage } from "@/features/wastage/model/wastage";

const wastage = (overrides: Partial<Wastage>): Wastage => ({
  id: "w",
  productName: "Dana",
  reason: "Bozuldu",
  quantity: 1,
  cost: 10000,
  occurredAt: "2026-01-01T10:00:00Z",
  responsible: "Ayşe",
  ...overrides,
});

describe("WastageProductReportScreen", () => {
  it("rolls the records up per product with the total cost", () => {
    render(<WastageProductReportScreen wastages={[wastage({ cost: 10000 }), wastage({ cost: 5000, quantity: 2 }), wastage({ productName: "Çay", cost: 1000 })]} />);

    expect(screen.getByText(/2 ürün/)).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Dana" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Çay" })).toBeInTheDocument();
    expect(screen.getByText(/160,00/)).toBeInTheDocument();
  });

  it("says so when nothing was wasted, and disables the export", () => {
    render(<WastageProductReportScreen wastages={[]} />);

    expect(screen.getByText("Henüz fire / zayi kaydı yok.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /İndir/ })).toBeDisabled();
  });
});
