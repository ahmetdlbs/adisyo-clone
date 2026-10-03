import type { Metadata } from "next";
import { ReportingWizardScreen } from "@/features/reports/components/reporting-wizard-screen";
import { fetchProductSales } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Rapor Sihirbazı" };

export default async function ReportingWizardPage() {
  const products = await fetchProductSales();
  return <ReportingWizardScreen products={products} />;
}
