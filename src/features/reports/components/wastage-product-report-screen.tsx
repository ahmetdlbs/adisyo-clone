"use client";

import { useMemo } from "react";
import { Download, Flame } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { downloadCsv, kurusCell } from "@/lib/csv";
import { formatKurus } from "@/lib/money";
import { totalWastageCost, wastageByProduct, type Wastage, type WastageByProduct } from "@/features/wastage/model/wastage";

/** Zayi/fire records rolled up per product: how often, how much and what it cost. */
export function WastageProductReportScreen({ wastages }: { wastages: readonly Wastage[] }) {
  const rows = useMemo(() => wastageByProduct(wastages), [wastages]);

  const columns: readonly DataTableColumn<WastageByProduct>[] = [
    { id: "product", header: "Ürün", cell: (row) => row.productName },
    { id: "count", header: "Kayıt", align: "right", cell: (row) => row.count },
    { id: "quantity", header: "Toplam Miktar", align: "right", cell: (row) => row.quantity },
    { id: "cost", header: "Maliyet", align: "right", cell: (row) => formatKurus(row.cost) },
  ];

  const handleExport = () =>
    downloadCsv(
      "fire-raporu.csv",
      ["Ürün", "Kayıt", "Toplam Miktar", "Maliyet"],
      rows.map((row) => [row.productName, row.count, row.quantity, kurusCell(row.cost)]),
    );

  return (
    <PageContainer className="max-w-4xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Flame}
          title="Fire Raporu"
          description={`${rows.length} ürün · Toplam fire maliyeti: ${formatKurus(totalWastageCost(wastages))}`}
          actions={
            <Button variant="ghost" className="text-primary" onClick={handleExport} disabled={rows.length === 0}>
              <Download />
              İndir
            </Button>
          }
        />
        <PageBody className="pt-4">
          <DataTable columns={columns} rows={rows} getRowId={(row) => row.productName} caption="Ürün bazlı fire raporu" emptyMessage="Henüz fire / zayi kaydı yok." />
        </PageBody>
      </PageCard>
    </PageContainer>
  );
}
