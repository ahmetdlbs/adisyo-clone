import type { Metadata } from "next";
import { KitchenScreen } from "@/features/pos/components/kitchen-screen";

export const metadata: Metadata = { title: "Mutfak" };

export default function KitchenDetailPage() {
  return <KitchenScreen />;
}
