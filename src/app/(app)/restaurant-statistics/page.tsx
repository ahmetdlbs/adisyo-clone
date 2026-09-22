import type { Metadata } from "next";
import { RestaurantStatisticsScreen } from "@/features/reports/components/restaurant-statistics-screen";

export const metadata: Metadata = { title: "Restaurant İstatistikleri" };

export default function RestaurantStatisticsPage() {
  return <RestaurantStatisticsScreen />;
}
