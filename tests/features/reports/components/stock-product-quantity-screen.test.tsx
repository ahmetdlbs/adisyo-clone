import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StockProductQuantityScreen } from "@/features/reports/components/stock-product-quantity-screen";

describe("StockProductQuantityScreen", () => {
  it("says stock is not tracked yet and points at product definitions", () => {
    render(<StockProductQuantityScreen />);

    expect(screen.getByRole("heading", { name: "Ürünlerin stok durumu" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Menü / Ürünler" })).toHaveAttribute("href", "/product-definition");
  });
});
