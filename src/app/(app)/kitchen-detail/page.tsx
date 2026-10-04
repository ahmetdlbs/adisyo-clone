import type { Metadata } from "next";
import { APP_KEYS } from "@/features/entitlements/model/app-keys";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { KitchenScreen } from "@/features/pos/components/kitchen-screen";

export const metadata: Metadata = { title: "Mutfak" };

export default async function KitchenDetailPage() {
  await requireApp([APP_KEYS.kitchenScreen]);
  return <KitchenScreen />;
}
