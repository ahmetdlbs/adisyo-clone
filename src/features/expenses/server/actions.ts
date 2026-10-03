"use server";

import { revalidatePath } from "next/cache";
import { ROUTES } from "@/config/routes";
import { ApiError, apiFetch } from "@/lib/api-client";
import type { Expense, ExpenseFormValues } from "../model/expense";

/** Records a new expense — append-only, like a real expense log: no update/delete. */
export async function createExpense(values: ExpenseFormValues): Promise<Expense> {
  try {
    const expense = await apiFetch<Expense>("/expenses", { method: "POST", body: values });
    revalidatePath(ROUTES.restaurantExpenses);
    return expense;
  } catch (error) {
    throw error instanceof ApiError ? new Error(error.message) : new Error("Masraf eklenemedi");
  }
}
