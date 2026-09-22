import type { Metadata } from "next";
import { ProductSalesReportScreen } from "@/features/reports/components/product-sales-report-screen";

export const metadata: Metadata = { title: "Ürün Satış Raporu" };

export default function ReportSalesProductsPage() {
  return <ProductSalesReportScreen />;
}
