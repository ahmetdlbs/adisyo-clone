"use client";

import { useState } from "react";
import { Ban, DollarSign, Receipt, Wallet } from "lucide-react";
import { Panel } from "@/components/kit/panel";
import { StatCard } from "@/components/kit/stat-card";
import { formatKurus } from "@/lib/money";
import { openOrderTotal } from "@/features/pos/model/pos-state";
import type { Order } from "@/features/pos/model/order";
import { PaymentBreakdown } from "@/features/pos/components/payment-breakdown";
import type { DaySummary } from "@/features/pos/model/stats";
import { usePosState } from "@/features/pos/store/pos-provider";
import { ClosedOrdersTable } from "./closed-orders-table";
import { NoReportData, ReportTabShell, type ReportTab } from "./report-tab-shell";

const REPORT_TABS: readonly ReportTab[] = [
  { id: "ozet", label: "Özet" },
  { id: "tum_adisyonlar", label: "Tüm Adisyonlar" },
  { id: "yogunluk", label: "Yoğunluk Raporu" },
  { id: "masa", label: "Masa Siparişleri" },
  { id: "gel_al", label: "Gel Al Siparişler" },
  { id: "paket", label: "Paket Siparişler" },
  { id: "acik_hesap", label: "Açık Hesap Hareketleri" },
  { id: "odenmezler", label: "Ödenmezler" },
  { id: "garson", label: "Garson Bazlı Satışlar" },
  { id: "iptal_iade", label: "İptal / İadeler" },
  { id: "masraflar", label: "Masraflar" },
  { id: "zayi", label: "Zayi Olan Ürünler" },
  { id: "silinen_urun", label: "Silinen Ürünler" },
  { id: "silinen_tahsilat", label: "Silinen Tahsilatlar" },
];

const SUMMARY_TAB = "ozet";
const ALL_ORDERS_TAB = "tum_adisyonlar";

interface EndOfDayReportScreenProps {
  day: DaySummary;
  closedOrders: readonly Order[];
}

/**
 * "Özet" and "Tüm Adisyonlar" are real, fetched server-side from api/'s /reports endpoints; the other tabs
 * stand for report types nothing in this demo tracks yet (waiters, stock, refunds, deletions), so they say so
 * honestly instead of showing fake zeros the way the original screen did.
 */
export function EndOfDayReportScreen({ day, closedOrders }: EndOfDayReportScreenProps) {
  const [tab, setTab] = useState(SUMMARY_TAB);
  const state = usePosState();

  return (
    <ReportTabShell title="Gün Sonu Raporu" tabs={REPORT_TABS} activeTab={tab} onTabChange={setTab}>
      {tab === SUMMARY_TAB && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={DollarSign} label="Bugünkü Ciro" value={formatKurus(day.salesTotal)} footer={`Ortalama adisyon ${formatKurus(day.averageBill)}`} />
            <StatCard icon={Receipt} tone="success" label="Kapatılan Adisyon" value={day.paidCount} />
            <StatCard icon={Ban} tone="destructive" label="İptal Edilen Adisyon" value={day.cancelledCount} footer={formatKurus(day.cancelledTotal)} />
            <StatCard icon={Wallet} tone="warning" label="Tahsil Edilmemiş Tutar" value={formatKurus(openOrderTotal(state))} footer="Açık siparişler" />
          </div>

          <Panel title="Alınan Ödemeler">
            <PaymentBreakdown methods={day.byMethod} />
          </Panel>
        </div>
      )}
      {tab === ALL_ORDERS_TAB && <ClosedOrdersTable orders={closedOrders} />}
      {tab !== SUMMARY_TAB && tab !== ALL_ORDERS_TAB && <NoReportData />}
    </ReportTabShell>
  );
}
