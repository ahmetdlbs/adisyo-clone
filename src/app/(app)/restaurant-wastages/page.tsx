import type { Metadata } from "next";
import { WastageScreen } from "@/features/wastage/components/wastage-screen";

export const metadata: Metadata = { title: "Fireler" };

export default function RestaurantWastagesPage() {
  return <WastageScreen />;
}
