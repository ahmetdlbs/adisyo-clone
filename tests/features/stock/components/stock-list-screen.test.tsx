import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StockListScreen } from "@/features/stock/components/stock-list-screen";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.info.mockClear());

describe("StockListScreen", () => {
  it("starts on the list of stock movements", () => {
    render(<StockListScreen />);

    expect(screen.getByRole("heading", { level: 1, name: "Stok Listesi" })).toBeInTheDocument();
    expect(screen.getByText("Herhangi bir kayıt bulunamadı.")).toBeInTheDocument();
  });

  it("switches to the new-entry screen and back", async () => {
    const user = userEvent.setup();
    render(<StockListScreen />);

    await user.click(screen.getByRole("button", { name: "Yeni Stok Girişi" }));
    expect(screen.getByRole("heading", { level: 1, name: "Stok Giriş İşlemleri" })).toBeInTheDocument();
    expect(screen.getByText("Stok takibi aktif ürün bulunamadı")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Geri" }));
    expect(screen.getByRole("heading", { level: 1, name: "Stok Listesi" })).toBeInTheDocument();
  });

  it("says stock counting and export are not available yet", async () => {
    const user = userEvent.setup();
    render(<StockListScreen />);

    await user.click(screen.getByRole("button", { name: "İndir" }));
    await user.click(screen.getByRole("button", { name: "Stok Sayımı" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });

  it("points at product definitions to turn stock tracking on", async () => {
    const user = userEvent.setup();
    render(<StockListScreen />);

    await user.click(screen.getByRole("button", { name: "Yeni Stok Girişi" }));

    expect(screen.getByRole("link", { name: "Menü / Ürünler" })).toHaveAttribute("href", "/product-definition");
  });
});
