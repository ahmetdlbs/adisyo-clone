import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WastageScreen } from "@/features/wastage/components/wastage-screen";
import type { Wastage } from "@/features/wastage/model/wastage";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({ createWastage: vi.fn() }));
vi.mock("@/features/wastage/server/actions", () => actions);

beforeEach(() => {
  Object.values(toast).forEach((mock) => mock.mockClear());
  actions.createWastage.mockReset();
});

const KOLA: Wastage = { id: "w1", productName: "Kola", reason: "Kırıldı", quantity: 2, cost: 4000, occurredAt: "2026-09-20T10:00:00.000Z", responsible: "Ahmet Can" };

function setup(items: Wastage[] = []) {
  render(<WastageScreen wastages={items} />);
  return userEvent.setup();
}

describe("WastageScreen", () => {
  it("has a heading, lists a record and totals the cost", () => {
    setup([KOLA, { ...KOLA, id: "w2", productName: "Ayran", cost: 1000 }]);

    expect(screen.getByRole("heading", { level: 1, name: "Zayi İşlemleri" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Kola/ })).toHaveTextContent("₺40,00");
    expect(screen.getByText("Toplam")).toBeInTheDocument();
    expect(screen.getByText("₺50,00")).toBeInTheDocument();
  });

  it("says there is nothing yet", () => {
    setup();

    expect(screen.getByText("Herhangi bir sonuç bulunamadı.")).toBeInTheDocument();
    expect(screen.getByText("₺0,00")).toBeInTheDocument();
  });

  it("calls createWastage with the entered values and shows a success toast", async () => {
    actions.createWastage.mockResolvedValue(KOLA);
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Ekle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Zayi Ekle" }));
    await user.type(dialog.getByRole("textbox", { name: "Ürün" }), "Ayran");
    const quantity = dialog.getByRole("textbox", { name: /Miktar/ });
    await user.clear(quantity);
    await user.type(quantity, "3");
    await user.type(dialog.getByRole("textbox", { name: /Maliyet/ }), "30");
    await user.type(dialog.getByRole("textbox", { name: "Zayi nedeni" }), "Son kullanma tarihi geçti");
    await user.type(dialog.getByRole("textbox", { name: "Sorumlu Kişi" }), "Ahmet Can");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Zayi eklendi"));
    expect(actions.createWastage).toHaveBeenCalledWith(expect.objectContaining({ productName: "Ayran", quantity: 3, cost: 3000 }));
  });

  it("says what is missing, never calling createWastage", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Ekle" }));
    await user.click(within(await screen.findByRole("dialog", { name: "Zayi Ekle" })).getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("Ürün seçiniz")).toBeInTheDocument();
    expect(screen.getByText("Zayi nedeni zorunludur")).toBeInTheDocument();
    expect(screen.getByText("Sorumlu kişi zorunludur")).toBeInTheDocument();
    expect(actions.createWastage).not.toHaveBeenCalled();
  });

  it("shows an error toast when the save fails", async () => {
    actions.createWastage.mockRejectedValue(new Error("Zayi eklenemedi"));
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Ekle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Zayi Ekle" }));
    await user.type(dialog.getByRole("textbox", { name: "Ürün" }), "Ayran");
    await user.type(dialog.getByRole("textbox", { name: /Maliyet/ }), "30");
    await user.type(dialog.getByRole("textbox", { name: "Zayi nedeni" }), "SKT");
    await user.type(dialog.getByRole("textbox", { name: "Sorumlu Kişi" }), "Ahmet");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Zayi eklenemedi"));
  });

  it("tells the user editing responsible people is not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Sorumluları Düzenle" }));

    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
