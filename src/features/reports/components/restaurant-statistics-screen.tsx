"use client";

import { useState } from "react";
import { DollarSign, Percent, Receipt } from "lucide-react";
import { StatCard } from "@/components/kit/stat-card";
import { formatKurus } from "@/lib/money";
import type { DaySummary } from "@/features/pos/model/stats";
import { tableOccupancy } from "@/features/pos/model/stats";
import { usePosState } from "@/features/pos/store/pos-provider";
import { NoReportData, ReportTabShell, type ReportTab } from "./report-tab-shell";

const REPORT_TABS: readonly ReportTab[] = [
  { id: "ozet", label: "Özet" },
  { id: "gunluk_ciro", label: "Günlük Ciro Verileri" },
  { id: "grafik", label: "Grafik Verileri" },
  { id: "paket", label: "Paket Siparişler" },
  { id: "satis_kanali", label: "Satış Kanalı Bazında Satışlar" },
  { id: "garson", label: "Garson Bazlı Satışlar" },
  { id: "odenmez", label: "Ödenmez Bazlı Satışlar" },
];

const SUMMARY_TAB = "ozet";

/** "Özet" is real: `day` fetched server-side from api/'s /reports/day-summary, occupancy from the live floor. */
export function RestaurantStatisticsScreen({ day }: { day: DaySummary }) {
  const [tab, setTab] = useState(SUMMARY_TAB);
  const state = usePosState();
  const occupancy = tableOccupancy(state);

  return (
    <ReportTabShell title="Restaurant İstatistikleri" tabs={REPORT_TABS} activeTab={tab} onTabChange={setTab}>
      {tab === SUMMARY_TAB ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard icon={DollarSign} label="Bugünkü Ciro" value={formatKurus(day.salesTotal)} footer={`Ortalama adisyon ${formatKurus(day.averageBill)}`} />
          <StatCard icon={Receipt} tone="success" label="Kapatılan Adisyon" value={day.paidCount} />
          <StatCard icon={Percent} tone="warning" label="Masa Doluluğu" value={`%${occupancy.percent}`} footer={`${occupancy.occupied} / ${occupancy.total} masa dolu`} />
        </div>
      ) : (
        <NoReportData />
      )}
    </ReportTabShell>
  );
}
