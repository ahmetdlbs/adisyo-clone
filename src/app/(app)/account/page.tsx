import type { Metadata } from "next";
import { AccountInfoScreen } from "@/features/account/components/account-info-screen";

export const metadata: Metadata = { title: "Hesap Bilgileri" };

export default function AccountPage() {
  return <AccountInfoScreen />;
}
