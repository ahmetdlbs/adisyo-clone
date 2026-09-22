import type { Metadata } from "next";
import { DashboardScreen } from "@/features/pos/components/dashboard-screen";

export const metadata: Metadata = { title: "Ana Sayfa" };

export default function DashboardPage() {
  return <DashboardScreen />;
}
