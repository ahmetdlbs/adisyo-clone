import type { Metadata } from "next";
import { StockProductQuantityScreen } from "@/features/reports/components/stock-product-quantity-screen";

export const metadata: Metadata = { title: "Stok Durum Raporu" };

export default function StockProductQuantityPage() {
  return <StockProductQuantityScreen />;
}
