import type { Metadata } from "next";
import { DiscountsScreen } from "@/features/catalog/components/discounts-screen";
import { fetchDiscounts } from "@/features/catalog/server/discount-actions";

export const metadata: Metadata = { title: "İndirimler" };

export default async function DiscountsPage() {
  const discounts = await fetchDiscounts();
  return <DiscountsScreen discounts={discounts} />;
}
