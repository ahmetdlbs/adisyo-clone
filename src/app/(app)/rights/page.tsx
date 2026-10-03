import type { Metadata } from "next";
import { RightsScreen } from "@/features/users/components/rights-screen";
import type { PermissionGrants } from "@/features/users/model/permission";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Haklar" };

export default async function RightsPage() {
  const grants = await apiFetch<PermissionGrants>("/rights");
  return <RightsScreen initialGrants={grants} />;
}
