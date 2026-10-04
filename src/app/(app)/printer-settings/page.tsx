import type { Metadata } from "next";
import { APP_KEYS } from "@/features/entitlements/model/app-keys";
import { requireApp } from "@/features/entitlements/server/active-apps";
import { PrinterSettingsScreen } from "@/features/printer/components/printer-settings-screen";

export const metadata: Metadata = { title: "Yazıcılar" };

export default async function PrinterSettingsPage() {
  await requireApp([APP_KEYS.multiPrinter]);
  return <PrinterSettingsScreen />;
}
