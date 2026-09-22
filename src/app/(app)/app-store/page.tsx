import type { Metadata } from "next";
import { AppStoreScreen } from "@/features/app-store/components/app-store-screen";

export const metadata: Metadata = { title: "Uygulama Mağazası" };

export default function AppStorePage() {
  return <AppStoreScreen />;
}
