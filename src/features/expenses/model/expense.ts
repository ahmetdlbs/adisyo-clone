import { z } from "zod";
import type { Kurus } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";

export const EXPENSE_TYPES = ["Mutfak Gideri", "Personel Avansı", "Fatura", "Diğer"] as const;
export type ExpenseType = (typeof EXPENSE_TYPES)[number];

export const EXPENSE_PAYMENT_METHODS = [
  { value: "cash", label: "Nakit" },
  { value: "card", label: "Kredi Kartı" },
] as const;
export type ExpensePaymentMethod = (typeof EXPENSE_PAYMENT_METHODS)[number]["value"];

export interface Expense {
  id: string;
  type: ExpenseType;
  paymentMethod: ExpensePaymentMethod;
  /** kuruş. */
  amount: Kurus;
  /** ISO timestamp of when the expense happened. */
  occurredAt: string;
  note: string;
}

const MAX_NOTE_LENGTH = 200;

export const expenseFormSchema = z.object({
  type: z.enum(EXPENSE_TYPES),
  paymentMethod: z.enum(["cash", "card"]),
  amount: liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
  occurredAt: z
    .string()
    .min(1, "Tarih zorunludur")
    .transform((value, context) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        context.addIssue({ code: "custom", message: "Geçerli bir tarih giriniz" });
        return z.NEVER;
      }
      return date.toISOString();
    }),
  note: z.string().trim().max(MAX_NOTE_LENGTH, `Açıklama en fazla ${MAX_NOTE_LENGTH} karakter olabilir`),
});
export type ExpenseFormInput = z.input<typeof expenseFormSchema>;
export type ExpenseFormValues = z.output<typeof expenseFormSchema>;

export const totalExpenses = (expenses: readonly Expense[]): Kurus => expenses.reduce((sum, expense) => sum + expense.amount, 0);

/** What a search box looks through. */
export const expenseSearchText = (expense: Expense): string => `${expense.type} ${expense.note}`;
