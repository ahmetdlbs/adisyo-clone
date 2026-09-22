import type { Metadata } from "next";
import { ProductPairingScreen } from "@/features/integrations/components/product-pairing-screen";

export const metadata: Metadata = { title: "Ürün Eşleştirme" };

export default function ProductPairingPage() {
  return <ProductPairingScreen />;
}
