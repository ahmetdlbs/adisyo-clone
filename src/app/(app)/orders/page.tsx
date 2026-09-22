import type { Metadata } from "next";
import { OrdersScreen } from "@/features/pos/components/orders-screen";

export const metadata: Metadata = { title: "Sipariş" };

export default function OrdersPage() {
  return <OrdersScreen />;
}
