"use client";

import Link from "next/link";
import { ArrowUpDown, BarChart3, Layers, LayoutGrid, Receipt, TrendingUp, Users, Wallet } from "lucide-react";
import { PageContainer } from "@/components/kit/page";
import { Panel } from "@/components/kit/panel";
import { StatCard } from "@/components/kit/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/config/routes";
import { useNow } from "../hooks/use-now";
import { formatKurus } from "@/lib/money";
import { openOrderTotal } from "../model/pos-state";
import { openBillCount, summarizeDay, tableOccupancy } from "../model/stats";
import { usePosState } from "../store/pos-provider";
import { HourlySalesChart } from "./hourly-sales-chart";
import { OccupancyCard } from "./occupancy-card";
import { PaymentBreakdown } from "./payment-breakdown";

const STAT_SKELETON = <Skeleton data-testid="stat-skeleton" className="ml-auto h-8 w-24" />;
/** Keeps a card the same height as its neighbours when it has no footer text of its own, as the original did. */
const NO_FOOTER = <span className="invisible">-</span>;

/**
 * Today at a glance, read straight from the POS state. Figures that depend on the day are held back until the
 * client clock is known, so server HTML and the first browser render always agree. "Toplam Gider", the whole
 * "Finansal Analiz & Kârlılık" section and the guest count are honest zeros/estimates: nothing in this app tracks
 * expenses centrally, product cost, or a real headcount, so those can't be computed for real (same as the original).
 */
export function DashboardScreen() {
  const state = usePosState();
  const now = useNow();
  const day = now ? summarizeDay(state, now) : null;
  const openBills = openBillCount(state);

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
            iconClassName="bg-gradient-to-tr from-orange-500 to-orange-400 text-white"
            label="Bugünkü toplam satış tutarı"
            value={day ? formatKurus(day.salesTotal) : STAT_SKELETON}
            footer={
              <Link href={ROUTES.reports} className="hover:text-primary hover:underline">
                Gün sonu raporu
              </Link>
            }
          />
          <StatCard
            icon={Users}
            iconClassName="bg-gradient-to-tr from-sky-500 to-sky-400 text-white"
            label="Bugün ağırlanan misafir sayısı"
            value={day ? day.paidCount + openBills : STAT_SKELETON}
            footer={NO_FOOTER}
          />
          <StatCard
            icon={BarChart3}
            iconClassName="bg-gradient-to-tr from-green-500 to-green-400 text-white"
            label="Bugün açık sipariş toplamı"
            value={formatKurus(openOrderTotal(state))}
            footer={NO_FOOTER}
          />
          <StatCard
            icon={ArrowUpDown}
            iconClassName="bg-gradient-to-tr from-rose-500 to-rose-400 text-white"
            label="Bugünkü toplam gider tutarı"
            value={formatKurus(0)}
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
            iconClassName="bg-gradient-to-tr from-purple-500 to-purple-400 text-white"
            label="Toplam Stok Maliyeti"
            value={formatKurus(0)}
            footer="Depodaki Ürün Maliyeti"
          />
          <StatCard
            icon={Receipt}
            iconClassName="bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white"
            label="Satılan Ürün Maliyeti"
            value={formatKurus(0)}
            footer="Gerçek Satış Maliyeti"
          />
          <StatCard
            icon={TrendingUp}
            iconClassName="bg-gradient-to-tr from-teal-500 to-teal-400 text-white"
            label="Brüt Kâr"
            value={formatKurus(0)}
            footer="Ciro - Satılan Ürün Maliyeti"
          />
          <StatCard
            icon={Wallet}
            iconClassName="bg-gradient-to-tr from-cyan-500 to-cyan-400 text-white"
            label="Net Kâr"
            value={formatKurus(0)}
            footer="Brüt Kâr - Giderler"
          />
        </div>
      </section>

      <Panel title="Günlük Satış Miktarları" aside="Tutar (₺)">
        {day ? <HourlySalesChart hours={day.byHour} peakHour={day.peakHour} /> : <Skeleton className="h-64 w-full" />}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Bugün Yapılan Ödemeler">
          {day ? <PaymentBreakdown methods={day.byMethod} /> : <Skeleton className="h-40 w-full" />}
        </Panel>
        <Panel title="Masa Yoğunluğu (%)">
          <OccupancyCard occupancy={tableOccupancy(state)} />
        </Panel>
      </div>
    </PageContainer>
  );
}
