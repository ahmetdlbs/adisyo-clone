import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpensesScreen } from "@/features/expenses/components/expenses-screen";
import type { Expense } from "@/features/expenses/model/expense";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

const csv = vi.hoisted(() => ({ downloadCsv: vi.fn() }));
vi.mock("@/lib/csv", async (importActual) => ({ ...(await importActual<typeof import("@/lib/csv")>()), ...csv }));
const actions = vi.hoisted(() => ({ createExpense: vi.fn() }));
vi.mock("@/features/expenses/server/actions", () => actions);

beforeEach(() => {
  Object.values(toast).forEach((mock) => mock.mockClear());
  actions.createExpense.mockReset();
  csv.downloadCsv.mockReset();
});

const KITCHEN: Expense = { id: "e1", type: "Mutfak Gideri", paymentMethod: "cash", amount: 15000, occurredAt: "2026-09-20T10:00:00.000Z", note: "Sebze alımı" };

function setup(expenses: Expense[] = []) {
  render(<ExpensesScreen expenses={expenses} />);
  return userEvent.setup();
}

describe("ExpensesScreen", () => {
  it("has a heading and lists an expense with its type and amount", () => {
    setup([KITCHEN]);

    expect(screen.getByRole("heading", { level: 1, name: "Gider ve Masraflar" })).toBeInTheDocument();
    expect(screen.getByRole("row", { name: /Mutfak Gideri/ })).toHaveTextContent("₺150,00");
  });

  it("says there is nothing yet", () => {
    setup();

    expect(screen.getByText(/Herhangi bir sonuç bulunamadı/)).toBeInTheDocument();
  });

  it("calls createExpense with the entered values and shows a success toast", async () => {
    actions.createExpense.mockResolvedValue(KITCHEN);
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Ekle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Ekle" }));
    await user.type(dialog.getByRole("textbox", { name: /Tutar/ }), "75,5");
    await user.type(dialog.getByRole("textbox", { name: /Açıklama/ }), "Tamir");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Masraf eklendi"));
    expect(actions.createExpense).toHaveBeenCalledWith(expect.objectContaining({ amount: 7550, note: "Tamir" }));
  });

  it("says the amount is missing, never calling createExpense", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Ekle" }));
    await user.click(within(await screen.findByRole("dialog", { name: "Ekle" })).getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("Geçerli bir tutar giriniz")).toBeInTheDocument();
    expect(actions.createExpense).not.toHaveBeenCalled();
  });

  it("shows an error toast when the save fails", async () => {
    actions.createExpense.mockRejectedValue(new Error("Masraf eklenemedi"));
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Ekle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Ekle" }));
    await user.type(dialog.getByRole("textbox", { name: /Tutar/ }), "10");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Masraf eklenemedi"));
  });

  it("searches by type or note", async () => {
    const user = setup([KITCHEN, { ...KITCHEN, id: "e2", type: "Diğer", note: "Tamir" }]);

    await user.type(screen.getByRole("searchbox", { name: "Masraf Arama" }), "tamir");

    expect(screen.getByRole("row", { name: /Diğer/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Mutfak/ })).not.toBeInTheDocument();
  });

  it("tells the user that editing expense types is not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Tiplerini Düzenle" }));

    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });

  it("downloads the listed expenses as a CSV file", async () => {
    const user = setup([KITCHEN]);

    await user.click(screen.getByRole("button", { name: "İndir" }));

    expect(csv.downloadCsv).toHaveBeenCalledWith("masraflar.csv", expect.arrayContaining(["Masraf Tipi", "Tutar"]), [
      ["Mutfak Gideri", KITCHEN.occurredAt, "Nakit", "150,00", "Sebze alımı"],
    ]);
  });
});
