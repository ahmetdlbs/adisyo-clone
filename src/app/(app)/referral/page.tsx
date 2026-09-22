import type { Metadata } from "next";
import { DEMO_IDENTITY } from "@/config/demo-identity";
import { ReferralScreen } from "@/features/referral/components/referral-screen";

export const metadata: Metadata = { title: "Tavsiye Et ve Kazan" };

export default function ReferralPage() {
  return <ReferralScreen referralCode={`${DEMO_IDENTITY.name.toLocaleUpperCase("tr")}${DEMO_IDENTITY.restaurantId}`} />;
}
