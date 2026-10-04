import type { Metadata } from "next";
import { StockProductQuantityScreen } from "@/features/reports/components/stock-product-quantity-screen";
import { fetchStockItems } from "@/features/stock/server/actions";

export const metadata: Metadata = { title: "Stok Durum Raporu" };

export default async function StockProductQuantityPage() {
  return <StockProductQuantityScreen stockItems={await fetchStockItems()} />;
}
