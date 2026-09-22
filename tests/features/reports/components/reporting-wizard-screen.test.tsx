import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReportingWizardScreen } from "@/features/reports/components/reporting-wizard-screen";
import { useNow } from "@/features/pos/hooks/use-now";
import { createPosStore, PosProvider } from "@/features/pos/store/pos-provider";
import { billLine, buildClosedOrder, buildPosState, localTime } from "../../../support/pos-fixtures";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

vi.mock("@/features/pos/hooks/use-now", () => ({ useNow: vi.fn() }));

beforeEach(() => {
  toast.info.mockClear();
  vi.mocked(useNow).mockReturnValue(localTime(20));
});

function setup() {
  const initial = { ...buildPosState(), history: [buildClosedOrder({ id: "h1", closedAt: localTime(15), lines: [billLine("p-cay", 5200, 2)] })] };
  render(
    <PosProvider store={createPosStore({ initial, storage: null })}>
      <ReportingWizardScreen />
    </PosProvider>
  );
  return userEvent.setup();
}

describe("ReportingWizardScreen", () => {
  it("has a heading and shows today's product sales as a table", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Rapor Sihirbazı" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /p-cay/ })).toHaveTextContent("2");
  });

  it("switches to a chart view", async () => {
    const user = setup();

    await user.click(screen.getByRole("tab", { name: "Grafik" }));

    expect(screen.getByRole("img", { name: /Ürün satış grafiği/ })).toBeInTheDocument();
  });

  it("says exporting and saving are not available in this demo", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Excel" }));
    await user.click(screen.getByRole("button", { name: "Kaydet" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });

  describe("Raporu Düzenle", () => {
    it("opens the report-settings drawer with its two tabs and the pivot fields", async () => {
      const user = setup();

      await user.click(screen.getByRole("button", { name: "Raporu Düzenle" }));
      const drawer = within(await screen.findByRole("dialog", { name: "Rapor Ayarları" }));

      expect(drawer.getByRole("tab", { name: "Sütunlar", selected: true })).toBeInTheDocument();
      expect(drawer.getByRole("tab", { name: "Filtreler" })).toBeInTheDocument();
      expect(drawer.getByText("MEVCUT ALANLAR")).toBeInTheDocument();
      expect(drawer.getByText("Ürün")).toBeInTheDocument();
      expect(drawer.getByText("Sipariş Kanalı")).toBeInTheDocument();
    });

    it("Raporu Güncelle closes the drawer", async () => {
      const user = setup();

      await user.click(screen.getByRole("button", { name: "Raporu Düzenle" }));
      const drawer = within(await screen.findByRole("dialog", { name: "Rapor Ayarları" }));
      await user.click(drawer.getByRole("button", { name: "Raporu Güncelle" }));

      expect(screen.queryByRole("dialog", { name: "Rapor Ayarları" })).not.toBeInTheDocument();
    });

    it("Sıfırla also closes the drawer", async () => {
      const user = setup();

      await user.click(screen.getByRole("button", { name: "Raporu Düzenle" }));
      const drawer = within(await screen.findByRole("dialog", { name: "Rapor Ayarları" }));
      await user.click(drawer.getByRole("button", { name: "Sıfırla" }));

      expect(screen.queryByRole("dialog", { name: "Rapor Ayarları" })).not.toBeInTheDocument();
    });
  });
});
