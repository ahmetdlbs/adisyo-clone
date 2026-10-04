import type { Metadata } from "next";
import { APP_KEYS } from "@/features/entitlements/model/app-keys";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { ReportingWizardScreen } from "@/features/reports/components/reporting-wizard-screen";
import { fetchProductSales } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Rapor Sihirbazı" };

export default async function ReportingWizardPage() {
  await requireApp([APP_KEYS.advancedReporting]);
  const products = await fetchProductSales();
  return <ReportingWizardScreen products={products} />;
}
