import type { Metadata } from "next";
import { ShiftSalesScreen } from "@/features/reports/components/shift-sales-screen";

export const metadata: Metadata = { title: "Vardiya Satış Raporu" };

export default function ShiftSalesPage() {
  return <ShiftSalesScreen />;
}
