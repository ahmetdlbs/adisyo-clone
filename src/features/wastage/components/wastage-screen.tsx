"use client";

import { useState } from "react";
import { Download, Plus, TrendingDown, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { formatClock } from "@/lib/format";
import { formatKurus } from "@/lib/money";
import { notifyUnavailable } from "@/lib/notify";
import { saveWastage, totalWastageCost, type Wastage, type WastageFormValues } from "../model/wastage";
import { WastageFormDialog } from "./wastage-form-dialog";

export function WastageScreen({ initialWastages = [] }: { initialWastages?: readonly Wastage[] }) {
  const [wastages, setWastages] = useState(initialWastages);
  const dialog = useEntityDialog<never>();

  const handleSave = (values: WastageFormValues) => {
    setWastages((current) => saveWastage(current, values, () => crypto.randomUUID()));
    toast.success("Zayi eklendi");
    dialog.close();
  };

  const columns: readonly DataTableColumn<Wastage>[] = [
    { id: "product", header: "Ürün", cell: (wastage) => wastage.productName },
    { id: "reason", header: "Zayi Nedeni", cell: (wastage) => wastage.reason },
    { id: "quantity", header: "Adet", cell: (wastage) => wastage.quantity },
    { id: "date", header: "Zayi Tarihi", cell: (wastage) => formatClock(wastage.occurredAt) },
    { id: "responsible", header: "Sorumlu Kişi", cell: (wastage) => wastage.responsible },
    { id: "cost", header: "Maliyet Tutarı(₺)", align: "right", cell: (wastage) => formatKurus(wastage.cost) },
  ];

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={TrendingDown}
          title="Zayi İşlemleri"
          description="Yeni bir zayi ekleyebilir veya zayi işlemlerinizi buradan yönetebilirsiniz."
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Users />
                Sorumluları Düzenle
              </Button>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Download />
                İndir
              </Button>
              <Button onClick={dialog.openCreate}>
                <Plus />
                Ekle
              </Button>
            </>
          }
        />
        <PageToolbar className="justify-end">
          <span className="flex items-center gap-2 text-sm font-bold text-foreground">
            Toplam <span className="tabular-nums">{formatKurus(totalWastageCost(wastages))}</span>
          </span>
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable columns={columns} rows={wastages} getRowId={(wastage) => wastage.id} caption="Zayiler" emptyMessage="Herhangi bir sonuç bulunamadı." />
        </PageBody>
      </PageCard>

      <WastageFormDialog key={dialog.session} open={dialog.isOpen} onOpenChange={dialog.onOpenChange} onSave={handleSave} />
    </PageContainer>
  );
}
