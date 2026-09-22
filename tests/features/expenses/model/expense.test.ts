import { describe, expect, it } from "vitest";
import {
  EXPENSE_TYPES,
  EXPENSE_PAYMENT_METHODS,
  expenseFormSchema,
  expenseSearchText,
  saveExpense,
  totalExpenses,
  type Expense,
} from "@/features/expenses/model/expense";

const KITCHEN: Expense = {
  id: "e1",
  type: "Mutfak Gideri",
  paymentMethod: "cash",
  amount: 15000,
  occurredAt: "2026-09-20T10:00:00.000Z",
  note: "Sebze alımı",
};

const values = { type: EXPENSE_TYPES[0], paymentMethod: EXPENSE_PAYMENT_METHODS[0].value, amount: "150", occurredAt: "2026-09-20T10:00", note: "" };

describe("expenseFormSchema", () => {
  it("turns a filled form into an expense, amount in kuruş and the date as an ISO string", () => {
    const result = expenseFormSchema.parse(values);

    expect(result.amount).toBe(15000);
    expect(result.occurredAt).toBe(new Date("2026-09-20T10:00").toISOString());
  });

  it("requires a positive amount", () => {
    expect(expenseFormSchema.safeParse({ ...values, amount: "0" }).error?.issues[0]?.message).toBe("Geçerli bir tutar giriniz");
    expect(expenseFormSchema.safeParse({ ...values, amount: "" }).success).toBe(false);
  });

  it("requires a date", () => {
    expect(expenseFormSchema.safeParse({ ...values, occurredAt: "" }).error?.issues[0]?.message).toBe("Tarih zorunludur");
  });

  it("does not need a note", () => {
    expect(expenseFormSchema.safeParse({ ...values, note: "" }).success).toBe(true);
  });
});

describe("saveExpense", () => {
  it("adds an expense", () => {
    const result = saveExpense([], { type: "Mutfak Gideri", paymentMethod: "cash", amount: 1000, occurredAt: "2026-09-20T10:00:00.000Z", note: "" }, () => "new-id");

    expect(result).toEqual([{ id: "new-id", type: "Mutfak Gideri", paymentMethod: "cash", amount: 1000, occurredAt: "2026-09-20T10:00:00.000Z", note: "" }]);
  });

  it("does not modify the list it is given", () => {
    const list: Expense[] = [];

    saveExpense(list, { type: "Mutfak Gideri", paymentMethod: "cash", amount: 1000, occurredAt: "2026-09-20T10:00:00.000Z", note: "" }, () => "id");

    expect(list).toEqual([]);
  });
});

describe("totalExpenses", () => {
  it("adds up the amounts", () => {
    expect(totalExpenses([KITCHEN, { ...KITCHEN, id: "e2", amount: 5000 }])).toBe(20000);
    expect(totalExpenses([])).toBe(0);
  });
});

describe("expenseSearchText", () => {
  it("covers the type and the note", () => {
    expect(expenseSearchText(KITCHEN)).toContain("Mutfak Gideri");
    expect(expenseSearchText(KITCHEN)).toContain("Sebze alımı");
  });
});
