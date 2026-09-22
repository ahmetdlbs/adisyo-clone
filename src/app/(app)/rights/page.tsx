import type { Metadata } from "next";
import { RightsScreen } from "@/features/users/components/rights-screen";

export const metadata: Metadata = { title: "Haklar" };

export default function RightsPage() {
  return <RightsScreen />;
}
