import type { Metadata } from "next";
import { PaidlessesScreen } from "@/features/customers/components/paidlesses-screen";
import type { Paidless } from "@/features/customers/model/paidless";
import { apiFetch } from "@/lib/api-client";

export const metadata: Metadata = { title: "Ödenmezler" };

export default async function RestaurantPaidlessesPage() {
  const items = await apiFetch<Paidless[]>("/paidless");
  return <PaidlessesScreen items={items} />;
}
