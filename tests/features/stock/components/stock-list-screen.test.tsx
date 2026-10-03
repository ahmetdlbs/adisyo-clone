import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StockListScreen } from "@/features/stock/components/stock-list-screen";
import type { StockItem } from "@/features/stock/model/stock-item";
import type { Unit } from "@/features/catalog/model/unit";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const actions = vi.hoisted(() => ({
  createStockItem: vi.fn(),
  updateStockItem: vi.fn(),
  adjustStockItem: vi.fn(),
  deleteStockItem: vi.fn(),
}));
vi.mock("@/features/stock/server/actions", () => actions);

beforeEach(() => {
  toast.success.mockClear();
  toast.error.mockClear();
  toast.info.mockClear();
  Object.values(actions).forEach((mock) => mock.mockReset());
});

const UNITS: Unit[] = [{ id: "u1", name: "Kg" }];

const ITEMS: StockItem[] = [
  { id: "s1", name: "Dana Kıyma", unitId: "u1", unitName: "Kg", quantity: 5, criticalLevel: 2, unitCost: 4000 },
  { id: "s2", name: "Domates", unitId: "u1", unitName: "Kg", quantity: 1, criticalLevel: 2 },
];

function setup(items: readonly StockItem[] = ITEMS) {
  render(<StockListScreen stockItems={items} units={UNITS} />);
  return { user: userEvent.setup() };
}

describe("StockListScreen", () => {
  it("lists every stock item with its quantity and unit", () => {
    setup();

    expect(screen.getByRole("heading", { level: 1, name: "Stok Listesi" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Dana Kıyma/ })).toHaveTextContent("5 Kg");
  });

  it("shows each card's unit cost and the value of what is on hand", () => {
    setup();

    expect(screen.getByRole("row", { name: /Dana Kıyma/ })).toHaveTextContent("₺40,00");
    expect(screen.getByRole("row", { name: /Dana Kıyma/ })).toHaveTextContent("₺200,00");
    expect(screen.getByRole("row", { name: /Domates/ })).toHaveTextContent("—");
  });

  it("flags an item at or below its critical level as low stock", () => {
    setup();

    expect(within(screen.getByRole("row", { name: /Domates/ })).getByText("Düşük Stok")).toBeInTheDocument();
    expect(within(screen.getByRole("row", { name: /Dana Kıyma/ })).queryByText("Düşük Stok")).not.toBeInTheDocument();
  });

  it("adds a stock item through the dialog", async () => {
    actions.createStockItem.mockResolvedValue({ id: "s3", name: "Tavuk Göğsü", unitId: "u1", unitName: "Kg", quantity: 8 });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Yeni Stok Kartı" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Stok Kartı Tanımla" }));
    await user.type(dialog.getByRole("textbox", { name: /Stok Kartı Adı/ }), "Tavuk Göğsü");
    await user.click(dialog.getByRole("combobox", { name: /Birim/ }));
    await user.click(await screen.findByRole("option", { name: "Kg" }));
    await user.type(dialog.getByRole("textbox", { name: /Mevcut Stok/ }), "8");
    await user.click(dialog.getByRole("button", { name: "Ekle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Stok kartı eklendi"));
    expect(actions.createStockItem).toHaveBeenCalledWith({ name: "Tavuk Göğsü", unitId: "u1", quantity: 8, unitCost: undefined, criticalLevel: undefined });
  });

  it("edits a stock item with its current values prefilled", async () => {
    actions.updateStockItem.mockResolvedValue(ITEMS[0]);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Dana Kıyma düzenle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Stok Kartı Tanımla" }));
    expect(dialog.getByRole("textbox", { name: /Mevcut Stok/ })).toHaveValue("5");
    await user.click(dialog.getByRole("button", { name: "Güncelle" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Stok kartı güncellendi"));
    expect(actions.updateStockItem).toHaveBeenCalledWith("s1", { name: "Dana Kıyma", unitId: "u1", quantity: 5, unitCost: 4000, criticalLevel: 2 });
  });

  it("adjusts a stock item's quantity through the entry dialog", async () => {
    actions.adjustStockItem.mockResolvedValue({ ...ITEMS[0], quantity: 15 });
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Dana Kıyma stok girişi" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Stok Girişi / Çıkışı" }));
    expect(dialog.getByText(/mevcut stok: 5 Kg/)).toBeInTheDocument();
    await user.type(dialog.getByRole("textbox", { name: /Miktar/ }), "10");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Stok güncellendi"));
    expect(actions.adjustStockItem).toHaveBeenCalledWith("s1", { delta: 10 });
  });

  it("asks before deleting and calls the API once confirmed", async () => {
    actions.deleteStockItem.mockResolvedValue(undefined);
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "Domates sil" }));
    await user.click(await screen.findByRole("button", { name: "Sil" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Stok kartı silindi"));
    expect(actions.deleteStockItem).toHaveBeenCalledWith("s2");
  });

  it("sends İndir and Stok Sayımı to notifyUnavailable — neither is built yet", async () => {
    const { user } = setup();

    await user.click(screen.getByRole("button", { name: "İndir" }));
    await user.click(screen.getByRole("button", { name: "Stok Sayımı" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
  });
});
