"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { useNow } from "@/features/pos/hooks/use-now";
import { formatKurus } from "@/lib/money";
import { productSalesToday, type ProductSales } from "@/features/pos/model/stats";
import { usePosState } from "@/features/pos/store/pos-provider";
import { NoReportData, ReportTabShell, type ReportTab } from "./report-tab-shell";

const REPORT_TABS: readonly ReportTab[] = [
  { id: "bolge", label: "Bölge Bazında" },
  { id: "kategori", label: "Kategori Bazında" },
  { id: "urun", label: "Ürün Bazında" },
  { id: "recete", label: "Reçeteli Ürün Bazında" },
  { id: "menu", label: "Menü Bazında" },
  { id: "ozellik", label: "Özellik Bazında" },
];

const PRODUCT_TAB = "urun";

const COLUMNS: readonly DataTableColumn<ProductSales>[] = [
  { id: "name", header: "Ürün Adı", cell: (row) => row.name },
  { id: "quantity", header: "Miktar", align: "right", cell: (row) => row.quantity },
  { id: "amount", header: "Toplam Tutar(₺)", align: "right", cell: (row) => formatKurus(row.amount) },
];

/**
 * "Ürün Bazında" is real, aggregated from today's paid bills (`productSalesToday`); the other dimensions
 * (region, category, recipe, menu, feature) are not attributes this demo's products carry, so they say so.
 */
export function ProductSalesReportScreen() {
  const [tab, setTab] = useState(PRODUCT_TAB);
  const state = usePosState();
  const now = useNow();
  const rows = now ? productSalesToday(state, now) : [];
  const total = rows.reduce((sum, row) => sum + row.amount, 0);
  const totalQuantity = rows.reduce((sum, row) => sum + row.quantity, 0);

  return (
    <ReportTabShell title="Ürün Satış Raporu" tabs={REPORT_TABS} activeTab={tab} onTabChange={setTab}>
      {tab === PRODUCT_TAB ? (
        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable columns={COLUMNS} rows={rows} getRowId={(row) => row.productId} caption="Ürün bazında satışlar" emptyMessage="Bugün satılan ürün yok." />
          {rows.length > 0 && (
            <div role="row" aria-label="Toplam" className="grid grid-cols-3 gap-4 border-t px-6 py-3 text-sm font-bold text-foreground">
              <span role="cell">Toplam</span>
              <span role="cell" className="text-right">
                {totalQuantity}
              </span>
              <span role="cell" className="text-right">
                {formatKurus(total)}
              </span>
            </div>
          )}
        </div>
      ) : (
        <NoReportData />
      )}
    </ReportTabShell>
  );
}
