import type { Metadata } from "next";
import { WastageScreen } from "@/features/wastage/components/wastage-screen";
import type { Wastage } from "@/features/wastage/model/wastage";
import { fetchStockItems } from "@/features/stock/server/actions";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Fireler" };

export default async function RestaurantWastagesPage() {
  const [wastages, stockItems] = await Promise.all([apiFetch<Wastage[]>("/wastage"), fetchStockItems()]);
  return <WastageScreen wastages={wastages} stockItems={stockItems} />;
}
