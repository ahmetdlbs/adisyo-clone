"use client";

import { useState } from "react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { formatKurus } from "@/lib/money";
import type { ProductSales } from "@/features/pos/model/stats";
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

const rowId = (row: ProductSales): string => row.productId ?? `deleted:${row.name}`;

/**
 * "Ürün Bazında" is real, aggregated server-side from today's paid bills (api/'s /reports/product-sales); the
 * other dimensions (region, category, recipe, menu, feature) are not attributes this demo's products carry, so
 * they say so.
 */
export function ProductSalesReportScreen({ products }: { products: readonly ProductSales[] }) {
  const [tab, setTab] = useState(PRODUCT_TAB);
  const total = products.reduce((sum, row) => sum + row.amount, 0);
  const totalQuantity = products.reduce((sum, row) => sum + row.quantity, 0);

  return (
    <ReportTabShell title="Ürün Satış Raporu" tabs={REPORT_TABS} activeTab={tab} onTabChange={setTab}>
      {tab === PRODUCT_TAB ? (
        <div className="rounded-lg border bg-card shadow-sm">
          <DataTable columns={COLUMNS} rows={products} getRowId={rowId} caption="Ürün bazında satışlar" emptyMessage="Bugün satılan ürün yok." />
          {products.length > 0 && (
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
