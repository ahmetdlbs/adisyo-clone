import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ServiceOperationsScreen } from "@/features/service/components/service-operations-screen";
import type { ServiceSettings } from "@/features/service/model/service-charge";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

function setup(initial?: ServiceSettings) {
  render(<ServiceOperationsScreen initialSettings={initial} />);
  return userEvent.setup();
}

const kuverCard = () => within(screen.getByRole("group", { name: "Kuver Ayarları" }));
const garsoniyeCard = () => within(screen.getByRole("group", { name: "Garsoniye Ayarları" }));

describe("ServiceOperationsScreen", () => {
  it("has a top switch and both charge cards", () => {
    setup();

    expect(screen.getByRole("switch", { name: "Kuver/Garsoniye tanımlamaları kullanılsın." })).toBeChecked();
    expect(kuverCard().getByRole("heading", { name: "Kuver Ayarları" })).toBeInTheDocument();
    expect(garsoniyeCard().getByRole("heading", { name: "Garsoniye Ayarları" })).toBeInTheDocument();
  });

  it("defines the kuver charge and turns its auto-add on", async () => {
    const user = setup();

    await user.type(kuverCard().getByRole("textbox", { name: "Kuver Adı" }), "Kuver");
    await user.type(kuverCard().getByRole("textbox", { name: "Kuver Tutarı" }), "10");
    await user.click(kuverCard().getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Kuver ayarları kaydedildi"));
    expect(kuverCard().getByRole("switch", { name: "Kuver ücreti siparişe otomatik eklensin" })).toBeChecked();
  });

  it("defines the garsoniye charge as a percent", async () => {
    const user = setup();

    await user.type(garsoniyeCard().getByRole("textbox", { name: "Garsoniye Adı" }), "Garsoniye");
    await user.click(garsoniyeCard().getByRole("combobox", { name: "Garsoniye Tipi" }));
    await user.click(await screen.findByRole("option", { name: "Yüzde" }));
    await user.type(garsoniyeCard().getByRole("textbox", { name: "Garsoniye Tutarı" }), "10");
    await user.click(garsoniyeCard().getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Garsoniye ayarları kaydedildi"));
  });

  it("says what is missing before saving", async () => {
    const user = setup();

    await user.click(kuverCard().getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("Ad zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Geçerli bir tutar giriniz")).toBeInTheDocument();
  });

  it("starts from an existing definition and lets its auto-add be turned off", async () => {
    const user = setup({ kuver: { name: "Kuver", kind: "amount", amount: 1000, autoAdd: true }, garsoniye: null });

    expect(kuverCard().getByRole("textbox", { name: "Kuver Adı" })).toHaveValue("Kuver");
    expect(kuverCard().getByRole("textbox", { name: "Kuver Tutarı" })).toHaveValue("10");

    await user.click(kuverCard().getByRole("switch", { name: "Kuver ücreti siparişe otomatik eklensin" }));
    await user.click(kuverCard().getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Kuver ayarları kaydedildi"));
  });
});
