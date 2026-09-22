import type { Metadata } from "next";
import { KitchenGroupsScreen } from "@/features/catalog/components/kitchen-groups-screen";

export const metadata: Metadata = { title: "Mutfak Grupları" };

export default function KitchenGroupsPage() {
  return <KitchenGroupsScreen />;
}
