import type { Metadata } from "next";
import { DiscountsScreen } from "@/features/catalog/components/discounts-screen";

export const metadata: Metadata = { title: "İndirimler" };

export default function DiscountsPage() {
  return <DiscountsScreen />;
}
