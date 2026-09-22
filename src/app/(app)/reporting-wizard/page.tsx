import type { Metadata } from "next";
import { ReportingWizardScreen } from "@/features/reports/components/reporting-wizard-screen";

export const metadata: Metadata = { title: "Rapor Sihirbazı" };

export default function ReportingWizardPage() {
  return <ReportingWizardScreen />;
}
