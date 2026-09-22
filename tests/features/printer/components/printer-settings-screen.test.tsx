import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrinterSettingsScreen } from "@/features/printer/components/printer-settings-screen";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.info.mockClear());

describe("PrinterSettingsScreen", () => {
  it("starts on the printers tab with no printer defined", () => {
    render(<PrinterSettingsScreen />);

    expect(screen.getByRole("heading", { level: 1, name: "Yazıcı Ayarları" })).toBeInTheDocument();
    expect(screen.getByText("Tanımlı Yazıcı Bulunamadı.")).toBeInTheDocument();
  });

  it("switches to the output-design tab", async () => {
    const user = userEvent.setup();
    render(<PrinterSettingsScreen />);

    await user.click(screen.getByRole("tab", { name: "Çıktı Tasarımı" }));

    expect(screen.getByText("Aktif yazıcı bulunamadı")).toBeInTheDocument();
  });

  it("lets a printer model be picked, with no consequence beyond the choice itself", async () => {
    const user = userEvent.setup();
    render(<PrinterSettingsScreen />);

    const multi = screen.getByRole("radio", { name: /Birden Fazla Yazıcı/ });
    const single = screen.getByRole("radio", { name: /Tek Yazıcı/ });
    expect(multi).toBeChecked();

    await user.click(single);

    expect(single).toBeChecked();
    expect(multi).not.toBeChecked();
  });

  it("says installing a printer is not available in this demo", async () => {
    const user = userEvent.setup();
    render(<PrinterSettingsScreen />);

    await user.click(screen.getByRole("button", { name: /Bulut Yazıcı Programını İndir/ }));
    await user.click(screen.getByRole("button", { name: "Yeni Yazıcı Ekle" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
