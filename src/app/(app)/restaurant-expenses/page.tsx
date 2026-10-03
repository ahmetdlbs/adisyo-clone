import type { Metadata } from "next";
import { ExpensesScreen } from "@/features/expenses/components/expenses-screen";
import type { Expense } from "@/features/expenses/model/expense";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Gider / Masraf İşlemleri" };

export default async function RestaurantExpensesPage() {
  const expenses = await apiFetch<Expense[]>("/expenses");
  return <ExpensesScreen expenses={expenses} />;
}
