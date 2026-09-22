import type { Metadata } from "next";
import { OrdersScreen } from "@/features/pos/components/orders-screen";

export const metadata: Metadata = { title: "Kontrol Ekranı" };

export default function ControlPagePage() {
  return <OrdersScreen />;
}
