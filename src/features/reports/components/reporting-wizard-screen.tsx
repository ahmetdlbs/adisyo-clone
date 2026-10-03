"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Download, FileText, GripVertical, Save, SlidersHorizontal, X } from "lucide-react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notifyUnavailable } from "@/lib/notify";
import type { ProductSales } from "@/features/pos/model/stats";

type View = "table" | "chart";
type DrawerTab = "columns" | "filters";

const COLUMNS: readonly DataTableColumn<ProductSales>[] = [
  { id: "name", header: "Ürün", cell: (row) => row.name },
  { id: "quantity", header: "Miktar", align: "right", cell: (row) => row.quantity },
];

const CHART_CONFIG = { quantity: { label: "Adet", color: "var(--primary)" } } satisfies ChartConfig;

/** Fields a pivot could group by. Purely for the field list in the drawer — nothing here rewires the report. */
const AVAILABLE_FIELDS = ["Tarih", "Ay ve Yıl", "Ay", "Hafta Günü", "Kategori", "Birim", "Bölge", "Garson", "Kurye", "Ödeme Tipi"];

/**
 * A stand-in for the original's drag-and-drop pivot builder: the one report it can actually build (today's
 * product sales, row = ürün, value = miktar) is real, from `productSalesToday`. "Raporu Düzenle" opens the same
 * field-picker drawer the original had — the field list and the assigned row/column are just as decorative here
 * as they were there (no drag-and-drop, nothing it does actually changes the report); only export/save, which
 * the original also left without a handler, say plainly that they are not available.
 */
export function ReportingWizardScreen({ products }: { products: readonly ProductSales[] }) {
  const [view, setView] = useState<View>("table");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("columns");
  const [showQuantity, setShowQuantity] = useState(true);
  const [showOrderCount, setShowOrderCount] = useState(false);
  const [showGrossAmount, setShowGrossAmount] = useState(false);
  const rows = products;

  return (
    <div className="flex h-full flex-col gap-4 overflow-auto p-6">
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="flex flex-col gap-4 border-b p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">Rapor Sihirbazı</h1>
            <div className="hidden h-10 w-px bg-border md:block" />
            <div className="flex items-center gap-3">
              <div aria-hidden="true" className="rounded bg-primary/10 p-2 text-primary">
                <FileText className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">Kayıtlı Rapor</span>
                <span className="text-[15px] leading-tight font-bold text-foreground">Ürün Bazlı Satış</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={notifyUnavailable}>
              <Download />
              Excel
            </Button>
            <Button variant="outline" onClick={notifyUnavailable}>
              <Save />
              Kaydet
            </Button>
            <Button onClick={() => setIsDrawerOpen(true)}>
              <SlidersHorizontal />
              Raporu Düzenle
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-b bg-muted/30 p-4">
          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-2">
              <span className="font-semibold tracking-wider text-muted-foreground">SATIR:</span>
              <Badge variant="secondary">Ürün</Badge>
            </span>
            <span className="flex items-center gap-2">
              <span className="font-semibold tracking-wider text-muted-foreground">DEĞER:</span>
              <Badge variant="secondary">Satış Adedi</Badge>
            </span>
          </div>
          <Tabs value={view} onValueChange={(value) => setView(value as View)}>
            <TabsList>
              <TabsTrigger value="table">Tablo</TabsTrigger>
              <TabsTrigger value="chart">Grafik</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-4">
          {view === "table" ? (
            <DataTable columns={COLUMNS} rows={rows} getRowId={(row) => row.productId ?? `deleted:${row.name}`} caption="Ürün bazlı satış" emptyMessage="Bugün satılan ürün yok." />
          ) : (
            <ProductSalesChart rows={rows} />
          )}
        </div>
      </div>

      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent className="flex flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="flex-row items-center gap-2 border-b px-6 py-4">
            <SlidersHorizontal aria-hidden="true" className="size-4 text-primary" />
            <SheetTitle className="text-base font-medium">Rapor Ayarları</SheetTitle>
          </SheetHeader>

          <Tabs value={drawerTab} onValueChange={(value) => setDrawerTab(value as DrawerTab)}>
            <TabsList variant="line" className="w-full justify-start rounded-none border-b px-6">
              <TabsTrigger value="columns">Sütunlar</TabsTrigger>
              <TabsTrigger value="filters">Filtreler</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-1 flex-col gap-6 overflow-auto px-6 py-4">
            <div>
              <h3 className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground">MEVCUT ALANLAR</h3>
              <div className="flex flex-col gap-3">
                {AVAILABLE_FIELDS.map((field) => (
                  <div key={field} className="flex items-center gap-3 text-sm text-foreground">
                    <GripVertical aria-hidden="true" className="size-3.5 text-muted-foreground/50" />
                    <span>{field}</span>
                  </div>
                ))}
              </div>
            </div>

            <PivotSlot title="SATIRLAR (HİYERARŞİK)" index={1} label="Ürün" />
            <PivotSlot title="SÜTUNLAR" label="Sipariş Kanalı" />

            <div>
              <h3 className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground">Σ DEĞERLER</h3>
              <div className="flex flex-col gap-3">
                <Field orientation="horizontal" className="items-center gap-3">
                  <Checkbox id="value-order-count" checked={showOrderCount} onCheckedChange={(checked) => setShowOrderCount(checked === true)} />
                  <FieldLabel htmlFor="value-order-count">Sipariş Sayısı</FieldLabel>
                </Field>
                <Field orientation="horizontal" className="items-center gap-3">
                  <Checkbox id="value-quantity" checked={showQuantity} onCheckedChange={(checked) => setShowQuantity(checked === true)} />
                  <FieldLabel htmlFor="value-quantity">Miktar</FieldLabel>
                </Field>
                <Field orientation="horizontal" className="items-center gap-3">
                  <Checkbox id="value-gross" checked={showGrossAmount} onCheckedChange={(checked) => setShowGrossAmount(checked === true)} />
                  <FieldLabel htmlFor="value-gross">Brüt Tutar</FieldLabel>
                </Field>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t bg-muted/30 p-6">
            <Button className="w-full" onClick={() => setIsDrawerOpen(false)}>
              Raporu Güncelle
            </Button>
            <Button variant="ghost" className="w-full text-primary" onClick={() => setIsDrawerOpen(false)}>
              Sıfırla
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function PivotSlot({ title, index, label }: { title: string; index?: number; label: string }) {
  return (
    <div>
      <h3 className="mb-3 text-[11px] font-semibold tracking-wider text-muted-foreground">{title}</h3>
      <div className="flex items-center justify-between rounded-md border border-dashed p-3">
        <div className="flex items-center gap-3 text-sm font-medium text-foreground">
          <GripVertical aria-hidden="true" className="size-3.5 text-muted-foreground/50" />
          {index && <span className="font-normal text-muted-foreground">{index}.</span>}
          <span>{label}</span>
        </div>
        <X aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </div>
    </div>
  );
}

function ProductSalesChart({ rows }: { rows: readonly ProductSales[] }) {
  const summary = rows.length === 0 ? "Bugün satılan ürün yok" : `En çok satan: ${rows[0]!.name} (${rows[0]!.quantity} adet)`;

  return (
    <div role="img" aria-label={`Ürün satış grafiği. ${summary}`} className="h-72 w-full">
      <ChartContainer config={CHART_CONFIG} className="aspect-auto h-full w-full">
        <BarChart data={[...rows]} margin={{ left: 0, right: 8, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent formatter={(value) => `${value} adet`} />}
          />
          <Bar dataKey="quantity" name="Adet" fill="var(--color-quantity)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
