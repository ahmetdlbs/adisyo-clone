import type { Metadata } from "next";
import { PaidlessesScreen } from "@/features/customers/components/paidlesses-screen";

export const metadata: Metadata = { title: "Ödenmezler" };

export default function RestaurantPaidlessesPage() {
  return <PaidlessesScreen />;
}
