import type { Metadata } from "next";
import { RestaurantSettingsScreen } from "@/features/settings/components/restaurant-settings-screen";
import { fetchRestaurantSettings } from "@/features/settings/server/actions";

export const metadata: Metadata = { title: "Restaurant Tanımlamaları" };

export default async function RestaurantSettingsPage() {
  const initialSettings = await fetchRestaurantSettings();
  return <RestaurantSettingsScreen initialSettings={initialSettings} />;
}
