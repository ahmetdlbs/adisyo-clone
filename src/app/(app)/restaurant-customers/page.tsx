import type { Metadata } from "next";
import { CustomersScreen } from "@/features/customers/components/customers-screen";

export const metadata: Metadata = { title: "Müşteriler" };

export default function RestaurantCustomersPage() {
  return <CustomersScreen />;
}
