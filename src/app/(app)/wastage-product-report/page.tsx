import type { Metadata } from "next";
import { WastageProductReportScreen } from "@/features/reports/components/wastage-product-report-screen";

export const metadata: Metadata = { title: "Fire Raporu" };

export default function WastageProductReportPage() {
  return <WastageProductReportScreen />;
}
