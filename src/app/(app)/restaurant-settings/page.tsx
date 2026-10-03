import type { Metadata } from "next";
import { RestaurantSettingsScreen } from "@/features/settings/components/restaurant-settings-screen";

export const metadata: Metadata = { title: "Restaurant Tanımlamaları" };

const DEFAULT_SETTINGS = { name: "Adisyon Cafe", dayStart: "06:00", dayEnd: "23:45", lockSeconds: "0", firstOrderNumber: "101" };

export default function RestaurantSettingsPage() {
  return <RestaurantSettingsScreen initialSettings={DEFAULT_SETTINGS} />;
}
