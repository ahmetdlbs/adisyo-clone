import type { Metadata } from "next";
import { AccountInfoScreen } from "@/features/account/components/account-info-screen";
import { fetchAccountEntitlements, fetchAccountPayments } from "@/features/account/server/actions";

export const metadata: Metadata = { title: "Hesap Bilgileri" };

export default async function AccountPage() {
  const [entitlements, payments] = await Promise.all([fetchAccountEntitlements(), fetchAccountPayments()]);
  return <AccountInfoScreen entitlements={entitlements} payments={payments} />;
}
