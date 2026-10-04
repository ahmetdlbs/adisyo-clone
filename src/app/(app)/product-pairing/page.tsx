import type { Metadata } from "next";
import { DELIVERY_APPS } from "@/config/navigation";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { ProductPairingScreen } from "@/features/integrations/components/product-pairing-screen";

export const metadata: Metadata = { title: "Ürün Eşleştirme" };

export default async function ProductPairingPage() {
  await requireApp(DELIVERY_APPS);
  return <ProductPairingScreen />;
}
