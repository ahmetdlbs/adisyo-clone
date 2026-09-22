import type { Metadata } from "next";
import { UnitsScreen } from "@/features/catalog/components/units-screen";

export const metadata: Metadata = { title: "Ürün Birimleri" };

export default function ProductUnitsPage() {
  return <UnitsScreen />;
}
