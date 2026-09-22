import type { Metadata } from "next";
import { IntegrationMenuOperationsScreen } from "@/features/integrations/components/integration-menu-operations-screen";

export const metadata: Metadata = { title: "Menü Operasyonları" };

export default function IntegrationMenuOperationsPage() {
  return <IntegrationMenuOperationsScreen />;
}
