import type { Metadata } from "next";
import { AppStoreScreen } from "@/features/app-store/components/app-store-screen";
import type { AppEntitlement, CatalogApp } from "@/features/app-store/model/app-store";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Uygulama Mağazası" };

export default async function AppStorePage() {
  const [apps, entitlements] = await Promise.all([
    apiFetch<CatalogApp[]>("/apps-catalog"),
    apiFetch<AppEntitlement[]>("/billing/entitlements"),
  ]);

  return <AppStoreScreen apps={apps} entitlements={entitlements} />;
}
