import type { Metadata } from "next";
import { AppStoreScreen } from "@/features/app-store/components/app-store-screen";
import type { AppEntitlement, CatalogApp } from "@/features/app-store/model/app-store";
import { fetchActiveApps } from "@/features/entitlements/server/active-apps";
import { ApiError, apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Uygulama Mağazası" };

export default async function AppStorePage({ searchParams }: { searchParams: Promise<{ need?: string }> }) {
  const [apps, activeKeys, entitlements, { need }] = await Promise.all([
    apiFetch<CatalogApp[]>("/apps-catalog"),
    fetchActiveApps(),
    // Owners only (it is billing data); everyone else just does not get renewal dates.
    apiFetch<AppEntitlement[]>("/billing/entitlements").catch((error: unknown) => {
      if (error instanceof ApiError && error.status === 403) return [];
      throw error;
    }),
    searchParams,
  ]);

  return <AppStoreScreen apps={apps} activeKeys={activeKeys} entitlements={entitlements} needKey={need} />;
}
