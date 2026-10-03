import type { Metadata } from "next";
import { VatScreen } from "@/features/catalog/components/vat-screen";
import type { VatDefinition } from "@/features/catalog/model/vat";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "KDV Oranları" };

export default async function VatDefinitionsPage() {
  const vats = await apiFetch<VatDefinition[]>("/vat-definitions");
  return <VatScreen vats={vats} />;
}
