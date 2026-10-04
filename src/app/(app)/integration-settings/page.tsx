import type { Metadata } from "next";
import { ErrorState } from "@/components/kit/error-state";
import { DELIVERY_APPS } from "@/config/navigation";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { IntegrationSettingsScreen } from "@/features/integrations/components/integration-settings-screen";
import { fetchIntegrations } from "@/features/integrations/server/actions";
import type { Integration } from "@/features/integrations/model/integration";
import { ApiError } from "@/lib/api-client";

export const metadata: Metadata = { title: "Entegrasyon Bağlantıları" };

export default async function IntegrationSettingsPage() {
  await requireApp(DELIVERY_APPS);

  let integrations: Integration[];
  try {
    integrations = await fetchIntegrations();
  } catch (error) {
    // Connections hold the account's secrets, so the API gives them to the account owner only.
    if (error instanceof ApiError && error.status === 403) {
      return <ErrorState title="Bu sayfa hesap sahibine açık" description="Entegrasyon bağlantılarını yalnızca hesap sahibi yönetebilir." />;
    }
    throw error;
  }
  return <IntegrationSettingsScreen integrations={integrations} />;
}
