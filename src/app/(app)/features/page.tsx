import type { Metadata } from "next";
import { FeaturesScreen } from "@/features/catalog/components/features-screen";
import { fetchFeatureGroups } from "@/features/catalog/server/feature-group-actions";

export const metadata: Metadata = { title: "Özellikler" };

export default async function FeaturesPage() {
  const groups = await fetchFeatureGroups();
  return <FeaturesScreen groups={groups} />;
}
