import type { Metadata } from "next";
import { WastageProductReportScreen } from "@/features/reports/components/wastage-product-report-screen";
import type { Wastage } from "@/features/wastage/model/wastage";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Fire Raporu" };

export default async function WastageProductReportPage() {
  const wastages = await apiFetch<Wastage[]>("/wastage");
  return <WastageProductReportScreen wastages={wastages} />;
}
