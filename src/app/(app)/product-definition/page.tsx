import type { Metadata } from "next";
import { ProductDefinitionScreen } from "@/features/pos/components/product-definition-screen";

export const metadata: Metadata = { title: "Menü / Ürünler" };

export default function ProductDefinitionPage() {
  return <ProductDefinitionScreen />;
}
