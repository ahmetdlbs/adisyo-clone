import type { Metadata } from "next";
import { StockListScreen } from "@/features/stock/components/stock-list-screen";

export const metadata: Metadata = { title: "Stok Listesi" };

export default function StockListPage() {
  return <StockListScreen />;
}
