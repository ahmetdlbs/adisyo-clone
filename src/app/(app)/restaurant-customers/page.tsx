import type { Metadata } from "next";
import { CustomersScreen } from "@/features/customers/components/customers-screen";
import type { Customer } from "@/features/customers/model/customer";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Müşteriler" };

export default async function RestaurantCustomersPage() {
  const customers = await apiFetch<Customer[]>("/customers");
  return <CustomersScreen customers={customers} />;
}
