import type { Metadata } from "next";
import { ServiceOperationsScreen } from "@/features/service/components/service-operations-screen";
import { fetchServiceSettings } from "@/features/service/server/actions";

export const metadata: Metadata = { title: "Servis İşlemleri" };

export default async function ServiceOperationsPage() {
  const settings = await fetchServiceSettings();
  return <ServiceOperationsScreen settings={settings} />;
}
