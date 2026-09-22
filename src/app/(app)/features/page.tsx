import type { Metadata } from "next";
import { FeaturesScreen } from "@/features/catalog/components/features-screen";

export const metadata: Metadata = { title: "Özellikler" };

export default function FeaturesPage() {
  return <FeaturesScreen />;
}
