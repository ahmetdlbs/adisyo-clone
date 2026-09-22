import type { Metadata } from "next";
import { VatScreen } from "@/features/catalog/components/vat-screen";

export const metadata: Metadata = { title: "KDV Oranları" };

export default function VatDefinitionsPage() {
  return <VatScreen />;
}
