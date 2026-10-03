import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { WastageProductReportScreen } from "@/features/reports/components/wastage-product-report-screen";

describe("WastageProductReportScreen", () => {
  it("explains the module and how to reach sales", () => {
    render(<WastageProductReportScreen />);

    expect(screen.getByRole("heading", { name: "Fire Tanımı Nedir?" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "info@adisyonmerkezi.com" })).toHaveAttribute("href", "mailto:info@adisyonmerkezi.com");
  });
});
