import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntegrationMenuOperationsScreen } from "@/features/integrations/components/integration-menu-operations-screen";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

describe("IntegrationMenuOperationsScreen", () => {
  it("says no data is shown until a brand is connected", () => {
    render(<IntegrationMenuOperationsScreen />);

    expect(screen.getByText(/Ekranda gösterilecek veri bulunamadı/)).toBeInTheDocument();
  });

  describe("Filtrele", () => {
    it("opens the filter panel and Temizle closes it again", async () => {
      const user = userEvent.setup();
      render(<IntegrationMenuOperationsScreen />);

      await user.click(screen.getByRole("button", { name: "Filtrele" }));
      const panel = within(await screen.findByRole("dialog", { name: "Filtrele" }));
      expect(panel.getByText("Pazar Yeri:")).toBeInTheDocument();
      expect(panel.getByText("Ürün Kategorisi:")).toBeInTheDocument();

      await user.click(panel.getByRole("button", { name: "Temizle" }));

      expect(screen.queryByRole("dialog", { name: "Filtrele" })).not.toBeInTheDocument();
    });

    it("Uygula closes the panel too", async () => {
      const user = userEvent.setup();
      render(<IntegrationMenuOperationsScreen />);

      await user.click(screen.getByRole("button", { name: "Filtrele" }));
      const panel = within(await screen.findByRole("dialog", { name: "Filtrele" }));
      await user.click(panel.getByRole("button", { name: "Uygula" }));

      expect(screen.queryByRole("dialog", { name: "Filtrele" })).not.toBeInTheDocument();
    });
  });

  describe("Ürün Durumu", () => {
    it("starts with both states on, and the button says so", () => {
      render(<IntegrationMenuOperationsScreen />);

      expect(screen.getByRole("button", { name: "Ürün Durumu: Aktif, Pasif" })).toBeInTheDocument();
    });

    it("updates the button label to match what is still checked", async () => {
      const user = userEvent.setup();
      render(<IntegrationMenuOperationsScreen />);

      await user.click(screen.getByRole("button", { name: /Ürün Durumu/ }));
      const panel = within(await screen.findByRole("dialog", { name: /Ürün Durumu/ }));
      await user.click(panel.getByRole("checkbox", { name: "Pasif" }));

      expect(await screen.findByRole("button", { name: "Ürün Durumu: Aktif" })).toBeInTheDocument();
    });
  });

  describe("Marka Seç", () => {
    it("opens the brand picker with the one channel this demo has, and Seç closes it", async () => {
      const user = userEvent.setup();
      render(<IntegrationMenuOperationsScreen />);

      await user.click(screen.getByRole("button", { name: "Marka Seç" }));
      const dialog = within(await screen.findByRole("dialog", { name: "Marka Seçimi" }));
      const anaKanal = dialog.getByRole("radio", { name: "Ana Kanal" });
      expect(anaKanal).toBeChecked();

      await user.click(dialog.getByRole("button", { name: "Seç" }));

      expect(screen.queryByRole("dialog", { name: "Marka Seçimi" })).not.toBeInTheDocument();
    });
  });
});
