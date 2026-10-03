import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductSalesReportScreen } from "@/features/reports/components/product-sales-report-screen";
import type { ProductSales } from "@/features/pos/model/stats";

const PRODUCTS: ProductSales[] = [{ productId: "p-cay", name: "p-cay", quantity: 3, amount: 15600 }];

function setup(products: readonly ProductSales[] = PRODUCTS) {
  render(<ProductSalesReportScreen products={products} />);
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
