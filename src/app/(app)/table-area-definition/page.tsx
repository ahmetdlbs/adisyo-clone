import type { Metadata } from "next";
import { TableAreaScreen } from "@/features/pos/components/table-area-screen";

export const metadata: Metadata = { title: "Masa / Bölgeler" };

export default function TableAreaDefinitionPage() {
  return <TableAreaScreen />;
}
