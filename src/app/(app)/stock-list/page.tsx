import type { Metadata } from "next";
import { StockListScreen } from "@/features/stock/components/stock-list-screen";
import { fetchStockItems } from "@/features/stock/server/actions";
import type { Unit } from "@/features/catalog/model/unit";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Stok Listesi" };

export default async function StockListPage() {
  const [stockItems, units] = await Promise.all([fetchStockItems(), apiFetch<Unit[]>("/units")]);
  return <StockListScreen stockItems={stockItems} units={units} />;
}
