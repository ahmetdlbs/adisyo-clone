import type { Metadata } from "next";
import { ServiceOperationsScreen } from "@/features/service/components/service-operations-screen";

export const metadata: Metadata = { title: "Servis İşlemleri" };

export default function ServiceOperationsPage() {
  return <ServiceOperationsScreen />;
}
