"use client";

import { useState } from "react";
import { ClipboardList, Download, PackagePlus, Package } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { downloadCsv, kurusCell } from "@/lib/csv";
import type { Unit } from "@/features/catalog/model/unit";
import { formatKurus } from "@/lib/money";
import {
  isLowStock,
  stockValue,
  type AdjustStockFormValues,
  type StockCountLine,
  type StockItem,
  type StockItemFormValues,
} from "../model/stock-item";
import {
  adjustStockItem,
  countStockItems,
  createStockItem,
  deleteStockItem,
  updateStockItem,
} from "../server/actions";
import { StockAdjustDialog } from "./stock-adjust-dialog";
import { StockCountDialog } from "./stock-count-dialog";
import { StockItemFormDialog } from "./stock-item-form-dialog";

export function StockListScreen({
  stockItems,
  units,
}: {
  stockItems: readonly StockItem[];
  units: readonly Unit[];
}) {
  const dialog = useEntityDialog<StockItem>();
  const [adjusting, setAdjusting] = useState<StockItem | null>(null);
  const [adjustSession, setAdjustSession] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [countSession, setCountSession] = useState(0);

  const handleSave = async (values: StockItemFormValues) => {
    if (dialog.editing) {
      await updateStockItem(dialog.editing.id, values);
      toast.success("Stok kartı güncellendi");
    } else {
      await createStockItem(values);
      toast.success("Stok kartı eklendi");
    }
    dialog.close();
  };

  const handleAdjust = async (values: AdjustStockFormValues) => {
    if (!adjusting) return;
    await adjustStockItem(adjusting.id, values);
    toast.success("Stok güncellendi");
    setAdjusting(null);
  };

  const handleCount = async (lines: StockCountLine[]) => {
    await countStockItems(lines);
    toast.success(`${lines.length} stok kartı sayıma göre güncellendi`);
    setIsCounting(false);
  };

  const handleDelete = (item: StockItem) => {
    deleteStockItem(item.id)
      .then(() => toast.success("Stok kartı silindi"))
      .catch((error: unknown) =>
        toast.error(
          error instanceof Error ? error.message : "Stok kartı silinemedi",
        ),
      );
  };

  const handleExport = () =>
    downloadCsv(
      "stok-listesi.csv",
      ["Stok Kartı", "Mevcut Stok", "Birim", "Birim Maliyet", "Stok Değeri", "Kritik Seviye"],
      stockItems.map((item) => [
        item.name,
        item.quantity,
        item.unitName,
        item.unitCost !== undefined ? kurusCell(item.unitCost) : "",
        item.unitCost !== undefined ? kurusCell(stockValue(item)) : "",
        item.criticalLevel,
      ]),
    );

  const columns: readonly DataTableColumn<StockItem>[] = [
    {
      id: "name",
      header: "STOK KARTI ADI",
      cell: (item) => (
        <span className="flex items-center gap-2">
          {item.name}
          {isLowStock(item) && (
            <Badge variant="destructive" className="text-[11px]">
              Düşük Stok
            </Badge>
          )}
        </span>
      ),
    },
    {
      id: "quantity",
      header: "MEVCUT STOK",
      align: "right",
      cell: (item) => `${item.quantity} ${item.unitName}`,
    },
    {
      id: "unitCost",
      header: "BİRİM MALİYET",
      align: "right",
      cell: (item) =>
        item.unitCost !== undefined ? formatKurus(item.unitCost) : "—",
    },
    {
      id: "value",
      header: "STOK DEĞERİ",
      align: "right",
      cell: (item) =>
        item.unitCost !== undefined ? formatKurus(stockValue(item)) : "—",
    },
    {
      id: "criticalLevel",
      header: "KRİTİK SEVİYE",
      align: "right",
      cell: (item) =>
        item.criticalLevel !== undefined
          ? `${item.criticalLevel} ${item.unitName}`
          : "—",
    },
    {
      id: "actions",
      header: "İŞLEMLER",
      align: "right",
      cell: (item) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${item.name} stok girişi`}
            onClick={() => {
              setAdjusting(item);
              setAdjustSession((session) => session + 1);
            }}
          >
            <PackagePlus />
          </Button>
          <RowActions
            name={item.name}
            onEdit={() => dialog.openEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Package}
          title="Stok Listesi"
          description="Reçeteli ürünlerin tükettiği hammaddeleri ve doğrudan stok takibi yapılan ürünleri buradan yönetebilirsiniz."
          actions={
            <>
              <Button
                variant="ghost"
                className="text-primary"
                onClick={handleExport}
              >
                <Download />
                İndir
              </Button>
              <Button
                variant="ghost"
                className="text-primary"
                onClick={() => {
                  setCountSession((session) => session + 1);
                  setIsCounting(true);
                }}
              >
                <ClipboardList />
                Stok Sayımı
              </Button>
              <Button onClick={dialog.openCreate}>
                <PackagePlus />
                Yeni Stok Kartı
              </Button>
            </>
          }
        />
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={stockItems}
            getRowId={(item) => item.id}
            caption="Stok Kartları"
            emptyMessage="Herhangi bir stok kartı bulunamadı."
          />
        </PageBody>
      </PageCard>

      <StockItemFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        item={dialog.editing}
        units={units}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
      <StockCountDialog
        key={`count-${countSession}`}
        open={isCounting}
        items={stockItems}
        onOpenChange={setIsCounting}
        onSave={handleCount}
      />
      <StockAdjustDialog
        key={`adjust-${adjustSession}`}
        open={adjusting !== null}
        item={adjusting}
        onOpenChange={(open) => !open && setAdjusting(null)}
        onSave={handleAdjust}
      />
    </PageContainer>
  );
}
