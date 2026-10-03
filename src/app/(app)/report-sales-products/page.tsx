import type { Metadata } from "next";
import { ProductSalesReportScreen } from "@/features/reports/components/product-sales-report-screen";
import { fetchProductSales } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Ürün Satış Raporu" };

export default async function ReportSalesProductsPage() {
  const products = await fetchProductSales();
  return <ProductSalesReportScreen products={products} />;
}
