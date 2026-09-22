import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductPairingScreen } from "@/features/integrations/components/product-pairing-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

describe("ProductPairingScreen", () => {
  it("shows both panels with nothing to pair yet", () => {
    render(<ProductPairingScreen />);

    expect(screen.getByRole("heading", { name: "Entegrasyon Ürünleri" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Adisyo Ürünler" })).toBeInTheDocument();
    expect(screen.getByText("Bütün ürünler eşleştirilmiştir")).toBeInTheDocument();
  });

  describe("Entegrasyon Değiştir", () => {
    it("opens the integration picker and closes it again", async () => {
      const user = userEvent.setup();
      render(<ProductPairingScreen />);

      await user.click(screen.getByRole("button", { name: "Entegrasyon Değiştir" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Entegrasyonlar" }));
      expect(dialog.getByText("Lütfen eşleştirme yapacağınız entegrasyonu seçiniz")).toBeInTheDocument();

      await user.click(dialog.getAllByRole("button", { name: "Kapat" })[0]!);

      expect(screen.queryByRole("dialog", { name: "Entegrasyonlar" })).not.toBeInTheDocument();
    });
  });

  describe("Ürünleri Otomatik Ekle", () => {
    it("opens the auto-add settings and cancelling closes it without saving", async () => {
      const user = userEvent.setup();
      render(<ProductPairingScreen />);

      await user.click(screen.getByRole("button", { name: "Ürünleri Otomatik Ekle" }));
      const popover = within(await screen.findByRole("dialog", { name: "Ürünleri Otomatik Ekle" }));
      expect(popover.getByText("Ürün KDV Grubu")).toBeInTheDocument();
      expect(popover.getByRole("checkbox", { name: "Mevcut eşleşmeleri kaldır" })).not.toBeChecked();

      await user.click(popover.getByRole("button", { name: "İptal" }));

      expect(screen.queryByRole("dialog", { name: "Ürünleri Otomatik Ekle" })).not.toBeInTheDocument();
      expect(toast.success).not.toHaveBeenCalled();
    });

    it("saving closes it and confirms, without pretending a real pairing ran", async () => {
      const user = userEvent.setup();
      render(<ProductPairingScreen />);

      await user.click(screen.getByRole("button", { name: "Ürünleri Otomatik Ekle" }));
      const popover = within(await screen.findByRole("dialog", { name: "Ürünleri Otomatik Ekle" }));
      await user.click(popover.getByRole("checkbox", { name: "Mevcut eşleşmeleri kaldır" }));
      await user.click(popover.getByRole("button", { name: "Kaydet" }));

      expect(screen.queryByRole("dialog", { name: "Ürünleri Otomatik Ekle" })).not.toBeInTheDocument();
      expect(toast.success).toHaveBeenCalledWith("Ayarlar kaydedildi");
    });
  });
});
