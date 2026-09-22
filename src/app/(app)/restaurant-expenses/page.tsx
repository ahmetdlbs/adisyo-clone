import type { Metadata } from "next";
import { ExpensesScreen } from "@/features/expenses/components/expenses-screen";

export const metadata: Metadata = { title: "Gider / Masraf İşlemleri" };

export default function RestaurantExpensesPage() {
  return <ExpensesScreen />;
}
