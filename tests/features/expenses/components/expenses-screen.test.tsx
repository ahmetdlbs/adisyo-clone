import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExpensesScreen } from "@/features/expenses/components/expenses-screen";
import type { Expense } from "@/features/expenses/model/expense";
import { UNAVAILABLE_MESSAGE } from "@/lib/notify";

const toast = vi.hoisted(() => ({ success: vi.fn(), error: vi.fn(), info: vi.fn() }));
vi.mock("sonner", () => ({ toast }));

beforeEach(() => toast.success.mockClear());

const KITCHEN: Expense = { id: "e1", type: "Mutfak Gideri", paymentMethod: "cash", amount: 15000, occurredAt: "2026-09-20T10:00:00.000Z", note: "Sebze alımı" };

function setup(expenses: Expense[] = []) {
  render(<ExpensesScreen initialExpenses={expenses} />);
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

  it("adds an expense", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Ekle" }));
    const dialog = within(await screen.findByRole("dialog", { name: "Ekle" }));
    await user.type(dialog.getByRole("textbox", { name: /Tutar/ }), "75,5");
    await user.type(dialog.getByRole("textbox", { name: /Açıklama/ }), "Tamir");
    await user.click(dialog.getByRole("button", { name: "Kaydet" }));

    await waitFor(() => expect(screen.getByRole("row", { name: /Tamir/ })).toBeInTheDocument());
    expect(toast.success).toHaveBeenCalledWith("Masraf eklendi");
  });

  it("says the amount is missing", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Ekle" }));
    await user.click(within(await screen.findByRole("dialog", { name: "Ekle" })).getByRole("button", { name: "Kaydet" }));

    expect(await screen.findByText("Geçerli bir tutar giriniz")).toBeInTheDocument();
  });

  it("searches by type or note", async () => {
    const user = setup([KITCHEN, { ...KITCHEN, id: "e2", type: "Diğer", note: "Tamir" }]);

    await user.type(screen.getByRole("searchbox", { name: "Masraf Arama" }), "tamir");

    expect(screen.getByRole("row", { name: /Diğer/ })).toBeInTheDocument();
    expect(screen.queryByRole("row", { name: /Mutfak/ })).not.toBeInTheDocument();
  });

  it("tells the user expense types and export are not available yet", async () => {
    const user = setup();

    await user.click(screen.getByRole("button", { name: "Masraf Tiplerini Düzenle" }));
    await user.click(screen.getByRole("button", { name: "İndir" }));

    expect(toast.info).toHaveBeenCalledTimes(2);
    expect(toast.info).toHaveBeenCalledWith(UNAVAILABLE_MESSAGE);
  });
});
