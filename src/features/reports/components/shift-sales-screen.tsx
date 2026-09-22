"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { Badge } from "@/components/ui/badge";
import { useNow } from "@/features/pos/hooks/use-now";
import { PaymentBreakdown } from "@/features/pos/components/payment-breakdown";
import { formatClock } from "@/lib/format";
import { formatKurus } from "@/lib/money";
import { orderTotal } from "@/features/pos/model/order";
import type { ClosedOrder } from "@/features/pos/model/pos-state";
import { closedOrdersToday, summarizeDay } from "@/features/pos/model/stats";
import { usePosState } from "@/features/pos/store/pos-provider";
import { NoReportData, ReportTabShell, type ReportTab } from "./report-tab-shell";

const REPORT_TABS: readonly ReportTab[] = [
  { id: "odeme", label: "Ödeme Raporu" },
  { id: "adisyon", label: "Adisyon Raporu" },
  { id: "kasa", label: "Kasa Raporu" },
];

const COLUMNS: readonly DataTableColumn<ClosedOrder>[] = [
  { id: "number", header: "#Adisyon No", cell: (entry) => `#${entry.order.number}` },
  { id: "opened", header: "Açılış Tarihi", cell: (entry) => formatClock(entry.order.openedAt) },
  { id: "closed", header: "Kapanış Tarihi", cell: (entry) => formatClock(entry.closedAt) },
  { id: "status", header: "Durum", cell: (entry) => (entry.outcome === "paid" ? <Badge variant="success">Ödendi</Badge> : <Badge variant="destructive">İptal</Badge>) },
  { id: "waiter", header: "Kullanıcı", cell: (entry) => entry.order.waiter },
  { id: "amount", header: "Tutar(₺)", align: "right", cell: (entry) => formatKurus(orderTotal(entry.order)) },
];

/**
 * "Ödeme Raporu" and "Adisyon Raporu" are real, from today's closed bills; "Kasa Raporu" stands for cash-register
 * shifts, which nothing in this demo opens or closes, so it says so instead of showing an empty table pretending
 * to be one.
 */
export function ShiftSalesScreen() {
  const [tab, setTab] = useState<(typeof REPORT_TABS)[number]["id"]>("odeme");
  const state = usePosState();
  const now = useNow();
  const day = now ? summarizeDay(state, now) : null;
  const closedToday = now ? closedOrdersToday(state, now) : [];

  return (
    <ReportTabShell title="Vardiya Satış Raporu" tabs={REPORT_TABS} activeTab={tab} onTabChange={(id) => setTab(id as typeof tab)}>
      {tab === "odeme" && (day ? <PaymentBreakdown methods={day.byMethod} /> : null)}
      {tab === "adisyon" && (
        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable
            columns={COLUMNS}
            rows={closedToday}
            getRowId={(entry) => entry.order.id}
            caption="Bugün kapanan adisyonlar"
            emptyMessage="Bugün kapanan adisyon yok."
          />
        </div>
      )}
      {tab === "kasa" && <NoReportData />}
    </ReportTabShell>
  );
}
