import type { Metadata } from "next";
import { UnitsScreen } from "@/features/catalog/components/units-screen";
import type { Unit } from "@/features/catalog/model/unit";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Ürün Birimleri" };

export default async function ProductUnitsPage() {
  const units = await apiFetch<Unit[]>("/units");
  return <UnitsScreen units={units} />;
}
