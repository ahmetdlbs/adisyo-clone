import type { Metadata } from "next";
import { DashboardScreen } from "@/features/pos/components/dashboard-screen";
import { fetchDaySummary } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Ana Sayfa" };

export default async function DashboardPage() {
  const day = await fetchDaySummary();
  return <DashboardScreen day={day} />;
}
