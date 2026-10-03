import type { Metadata } from "next";
import { EndOfDayReportScreen } from "@/features/reports/components/end-of-day-report-screen";
import { fetchClosedOrders, fetchDaySummary } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Gün Sonu Raporu" };

export default async function ReportsPage() {
  const [day, closedOrders] = await Promise.all([fetchDaySummary(), fetchClosedOrders()]);
  return <EndOfDayReportScreen day={day} closedOrders={closedOrders} />;
}
