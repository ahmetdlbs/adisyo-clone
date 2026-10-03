import type { Metadata } from "next";
import { RestaurantStatisticsScreen } from "@/features/reports/components/restaurant-statistics-screen";
import { fetchDaySummary } from "@/features/reports/server/actions";

export const metadata: Metadata = { title: "Restaurant İstatistikleri" };

export default async function RestaurantStatisticsPage() {
  const day = await fetchDaySummary();
  return <RestaurantStatisticsScreen day={day} />;
}
