import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RestaurantSettingsScreen } from "@/features/settings/components/restaurant-settings-screen";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ updateRestaurantSettings: vi.fn() }));
vi.mock("@/features/settings/server/actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
  actions.updateRestaurantSettings.mockReset().mockResolvedValue(undefined);
});

const defaults = { name: "Adisyon Cafe", dayStart: "06:00", dayEnd: "23:45", lockSeconds: "0", firstOrderNumber: "101" };

describe("RestaurantSettingsScreen", () => {
  it("shows the settings form pre-filled", () => {
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    expect(screen.getByRole("heading", { level: 1, name: "Restaurant Tanımlamaları" })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Restaurant Adı/ })).toHaveValue("Adisyon Cafe");
  });

  it("saves the settings", async () => {
    const user = userEvent.setup();
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Ayarlar güncellendi"));
    expect(actions.updateRestaurantSettings).toHaveBeenCalledWith({
      name: "Adisyon Cafe",
      dayStart: "06:00",
      dayEnd: "23:45",
      lockSeconds: 0,
      firstOrderNumber: 101,
      notificationSound: "1",
      workMode: "all",
    });
  });

  it("shows an error toast when saving fails", async () => {
    actions.updateRestaurantSettings.mockRejectedValue(new Error("Ayarlar güncellenemedi"));
    const user = userEvent.setup();
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Ayarlar güncellenemedi"));
  });

  it("says what is invalid", async () => {
    const user = userEvent.setup();
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    await user.clear(screen.getByRole("textbox", { name: /Restaurant Adı/ }));
    await user.click(screen.getByRole("button", { name: "Güncelle" }));

    expect(await screen.findByText("Restaurant adı zorunludur")).toBeInTheDocument();
  });

  it("switches the active tab, same as the original screen — no other tab ever had its own content either", async () => {
    const user = userEvent.setup();
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    await user.click(screen.getByRole("tab", { name: "Ödeme Tipleri" }));

    expect(screen.getByRole("tab", { name: "Ödeme Tipleri", selected: true })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /Restaurant Adı/ })).toHaveValue("Adisyon Cafe");
  });

  it("says the remaining actions are not available yet", async () => {
    const user = userEvent.setup();
    render(<RestaurantSettingsScreen initialSettings={defaults} />);

    await user.click(screen.getByRole("button", { name: "Dene" }));
    await user.click(screen.getByRole("button", { name: "Konumu Kaydet" }));
    await user.click(screen.getByRole("button", { name: "Gelir Merkezlerini Düzenle" }));

    expect(toast.info).toHaveBeenCalledTimes(3);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
