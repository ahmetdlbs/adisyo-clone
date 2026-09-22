import type { Metadata } from "next";
import { PrinterSettingsScreen } from "@/features/printer/components/printer-settings-screen";

export const metadata: Metadata = { title: "Yazıcılar" };

export default function PrinterSettingsPage() {
  return <PrinterSettingsScreen />;
}
