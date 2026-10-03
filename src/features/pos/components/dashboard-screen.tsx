"use client";

import Link from "next/link";
import { ArrowUpDown, BarChart3, Layers, LayoutGrid, Receipt, TrendingUp, Users, Wallet } from "lucide-react";
import { PageContainer } from "@/components/kit/page";
import { Panel } from "@/components/kit/panel";
import { StatCard } from "@/components/kit/stat-card";
import { ROUTES } from "@/config/routes";
import { formatKurus } from "@/lib/money";
import { openOrderTotal } from "../model/pos-state";
import type { DaySummary } from "../model/stats";
import { openBillCount, tableOccupancy } from "../model/stats";
import { usePosState } from "../store/pos-provider";
import { HourlySalesChart } from "./hourly-sales-chart";
import { OccupancyCard } from "./occupancy-card";
import { PaymentBreakdown } from "./payment-breakdown";

/** Keeps a card the same height as its neighbours when it has no footer text of its own, as the original did. */
const NO_FOOTER = <span className="invisible">-</span>;

/**
 * Today at a glance. `day` is fetched server-side (api/'s /reports/day-summary) so it needs no client clock and
 * has no hydration-mismatch risk; the live floor figures (open-order total, table occupancy) still read the POS
 * snapshot directly. Expenses, fire and the cost of goods sold (portion cost price × units) come from the same
 * summary, so Brüt/Net Kâr are real. "Toplam Stok Maliyeti" is the stock on hand × each card's unit cost and the
 * guest count is an estimate (paid bills + open bills; no real headcount is recorded).
 */
export function DashboardScreen({ day }: { day: DaySummary }) {
  const state = usePosState();
  const openBills = openBillCount(state);
  const grossProfit = day.salesTotal - day.costOfGoods;

  return (
    <PageContainer className="max-w-7xl gap-8">
      <h1 className="sr-only">Ana Sayfa</h1>

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="mb-8 text-[13px] font-bold tracking-wider text-muted-foreground uppercase">
          Genel Durum
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Layers}
            iconClassName="bg-orange-50 text-orange-600"
            label="Bugünkü toplam satış tutarı"
            value={formatKurus(day.salesTotal)}
            footer={
              <Link href={ROUTES.reports} className="hover:text-primary hover:underline">
                Gün sonu raporu
              </Link>
            }
          />
          <StatCard
            icon={Users}
            iconClassName="bg-sky-50 text-sky-600"
            label="Bugün ağırlanan misafir sayısı"
            value={day.paidCount + openBills}
            footer={NO_FOOTER}
          />
          <StatCard
            icon={BarChart3}
            iconClassName="bg-green-50 text-green-600"
            label="Bugün açık sipariş toplamı"
            value={formatKurus(openOrderTotal(state))}
            footer={NO_FOOTER}
          />
          <StatCard
            icon={ArrowUpDown}
            iconClassName="bg-rose-50 text-rose-600"
            label="Bugünkü toplam gider tutarı"
            value={formatKurus(day.expenseTotal)}
            footer={
              <Link href={ROUTES.restaurantExpenses} className="hover:text-primary hover:underline">
                Masraflar
              </Link>
            }
          />
        </div>
      </section>

      <section aria-labelledby="profitability-heading">
        <h2 id="profitability-heading" className="mb-8 text-[13px] font-bold tracking-wider text-muted-foreground uppercase">
          Finansal Analiz &amp; Kârlılık
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={LayoutGrid}
            iconClassName="bg-purple-50 text-purple-600"
            label="Toplam Stok Maliyeti"
            value={formatKurus(day.stockValue)}
            footer="Depodaki Ürün Maliyeti"
          />
          <StatCard
            icon={Receipt}
            iconClassName="bg-indigo-50 text-indigo-600"
            label="Satılan Ürün Maliyeti"
            value={formatKurus(day.costOfGoods)}
            footer="Gerçek Satış Maliyeti"
          />
          <StatCard
            icon={TrendingUp}
            iconClassName="bg-teal-50 text-teal-600"
            label="Brüt Kâr"
            value={formatKurus(grossProfit)}
            footer="Ciro - Satılan Ürün Maliyeti"
          />
          <StatCard
            icon={Wallet}
            iconClassName="bg-cyan-50 text-cyan-600"
            label="Net Kâr"
            value={formatKurus(grossProfit - day.expenseTotal - day.wastageTotal)}
            footer="Brüt Kâr - Gider - Zayi"
          />
        </div>
      </section>

      <Panel title="Günlük Satış Miktarları" aside="Tutar (₺)">
        <HourlySalesChart hours={day.byHour} peakHour={day.peakHour} />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Bugün Yapılan Ödemeler">
          <PaymentBreakdown methods={day.byMethod} />
        </Panel>
        <Panel title="Masa Yoğunluğu (%)">
          <OccupancyCard occupancy={tableOccupancy(state)} />
        </Panel>
      </div>
    </PageContainer>
  );
}
