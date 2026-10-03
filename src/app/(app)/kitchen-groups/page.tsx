import type { Metadata } from "next";
import { KitchenGroupsScreen } from "@/features/catalog/components/kitchen-groups-screen";
import type { KitchenGroup } from "@/features/catalog/model/kitchen-group";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Mutfak Grupları" };

export default async function KitchenGroupsPage() {
  const groups = await apiFetch<KitchenGroup[]>("/kitchen-groups");
  return <KitchenGroupsScreen groups={groups} />;
}
