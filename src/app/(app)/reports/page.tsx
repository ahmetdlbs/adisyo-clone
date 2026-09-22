import type { Metadata } from "next";
import { EndOfDayReportScreen } from "@/features/reports/components/end-of-day-report-screen";

export const metadata: Metadata = { title: "Gün Sonu Raporu" };

export default function ReportsPage() {
  return <EndOfDayReportScreen />;
}
