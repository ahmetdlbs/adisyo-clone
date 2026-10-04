"use client";

import { useState } from "react";
import { Download, PackageSearch } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { SearchInput } from "@/components/kit/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadCsv } from "@/lib/csv";
import { filterByQuery } from "@/lib/search";
import { isLowStock, type StockItem } from "@/features/stock/model/stock-item";

/** What is on the shelf right now, lowest relative to its critical level first. */
export function StockProductQuantityScreen({ stockItems }: { stockItems: readonly StockItem[] }) {
  const [query, setQuery] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);

  const lowCount = stockItems.filter(isLowStock).length;
  const rows = filterByQuery(onlyLow ? stockItems.filter(isLowStock) : stockItems, query, (item) => item.name);

  const columns: readonly DataTableColumn<StockItem>[] = [
    {
      id: "name",
      header: "Stok Kartı",
      cell: (item) => (
        <span className="flex items-center gap-2">
          {item.name}
          {isLowStock(item) && (
            <Badge variant="destructive" className="text-[11px]">
              {item.quantity < 0 ? "Eksiye Düştü" : "Düşük Stok"}
            </Badge>
          )}
        </span>
      ),
    },
    { id: "quantity", header: "Mevcut", align: "right", cell: (item) => `${item.quantity} ${item.unitName}` },
    { id: "critical", header: "Kritik Seviye", align: "right", cell: (item) => (item.criticalLevel !== undefined ? `${item.criticalLevel} ${item.unitName}` : "—") },
  ];

  const handleExport = () =>
    downloadCsv(
      "stok-durumu.csv",
      ["Stok Kartı", "Mevcut", "Birim", "Kritik Seviye"],
      rows.map((item) => [item.name, item.quantity, item.unitName, item.criticalLevel]),
    );

  return (
    <PageContainer className="max-w-4xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={PackageSearch}
          title="Stok Durum Raporu"
          description={`${stockItems.length} stok kartı · ${lowCount} tanesi kritik seviyede`}
          actions={
            <Button variant="ghost" className="text-primary" onClick={handleExport} disabled={rows.length === 0}>
              <Download />
              İndir
            </Button>
          }
        />
        <PageBody className="pt-4">
          <PageToolbar>
            <SearchInput value={query} onValueChange={setQuery} placeholder="Stok kartı ara" aria-label="Stok kartı ara" className="max-w-sm" />
            <Button variant={onlyLow ? "default" : "outline"} aria-pressed={onlyLow} onClick={() => setOnlyLow((current) => !current)}>
              Sadece kritik olanlar
            </Button>
          </PageToolbar>
          <DataTable columns={columns} rows={rows} getRowId={(item) => item.id} caption="Stok durumu" emptyMessage="Gösterilecek stok kartı yok." />
        </PageBody>
      </PageCard>
    </PageContainer>
  );
}
