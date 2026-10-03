import type { Metadata } from "next";
import { ShiftSalesScreen } from "@/features/reports/components/shift-sales-screen";
import { fetchClosedOrders, fetchDaySummary } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Vardiya Satış Raporu" };

export default async function ShiftSalesPage() {
  const [day, closedOrders] = await Promise.all([fetchDaySummary(), fetchClosedOrders()]);
  return <ShiftSalesScreen day={day} closedOrders={closedOrders} />;
}
