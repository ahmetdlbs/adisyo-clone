import type { Metadata } from "next";
import { DELIVERY_APPS } from "@/config/navigation";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { IntegrationMenuOperationsScreen } from "@/features/integrations/components/integration-menu-operations-screen";

export const metadata: Metadata = { title: "Menü Operasyonları" };

export default async function IntegrationMenuOperationsPage() {
  await requireApp(DELIVERY_APPS);
  return <IntegrationMenuOperationsScreen />;
}
