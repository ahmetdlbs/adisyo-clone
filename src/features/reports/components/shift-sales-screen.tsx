"use client";

import { useState } from "react";
import { PaymentBreakdown } from "@/features/pos/components/payment-breakdown";
import type { DaySummary } from "@/features/pos/model/stats";
import type { Order } from "@/features/pos/model/order";
import { ClosedOrdersTable } from "./closed-orders-table";
import { NoReportData, ReportTabShell, type ReportTab } from "./report-tab-shell";

const REPORT_TABS: readonly ReportTab[] = [
  { id: "odeme", label: "Ödeme Raporu" },
  { id: "adisyon", label: "Adisyon Raporu" },
  { id: "kasa", label: "Kasa Raporu" },
];

interface ShiftSalesScreenProps {
  day: DaySummary;
  closedOrders: readonly Order[];
}

/**
 * "Ödeme Raporu" and "Adisyon Raporu" are real, from today's closed bills (fetched server-side via api/'s
 * /reports endpoints); "Kasa Raporu" stands for cash-register shifts, which nothing in this demo opens or
 * closes, so it says so instead of showing an empty table pretending to be one.
 */
export function ShiftSalesScreen({ day, closedOrders }: ShiftSalesScreenProps) {
  const [tab, setTab] = useState<(typeof REPORT_TABS)[number]["id"]>("odeme");

  return (
    <ReportTabShell title="Vardiya Satış Raporu" tabs={REPORT_TABS} activeTab={tab} onTabChange={(id) => setTab(id as typeof tab)}>
      {tab === "odeme" && <PaymentBreakdown methods={day.byMethod} />}
      {tab === "adisyon" && <ClosedOrdersTable orders={closedOrders} />}
      {tab === "kasa" && <NoReportData />}
    </ReportTabShell>
  );
}
