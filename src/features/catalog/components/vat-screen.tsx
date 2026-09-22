"use client";

import { useState } from "react";
import { Percent, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { INITIAL_VAT_DEFINITIONS } from "../data/vat";
import { MAX_VAT_DEFINITIONS, removeVat, saveVat, type VatDefinition, type VatFormValues } from "../model/vat";
import { VatFormDialog } from "./vat-form-dialog";

export function VatScreen({ initialVats = INITIAL_VAT_DEFINITIONS }: { initialVats?: readonly VatDefinition[] }) {
  const [vats, setVats] = useState(initialVats);
  const dialog = useEntityDialog<VatDefinition>();

  const handleSave = (values: VatFormValues) => {
    // Computed outside the state updater: saveVat throws past the limit, which the disabled button prevents.
    setVats(saveVat(vats, values, dialog.editing?.id ?? null, () => crypto.randomUUID()));
    toast.success(dialog.editing ? "KDV grubu güncellendi" : "KDV grubu eklendi");
    dialog.close();
  };

  const handleDelete = (vat: VatDefinition) => {
    setVats(removeVat(vats, vat.id));
    toast.success("KDV grubu silindi");
  };

  const columns: readonly DataTableColumn<VatDefinition>[] = [
    { id: "order", header: "SIRA NO", cell: (vat) => vats.indexOf(vat) + 1, className: "w-20" },
    { id: "name", header: "TANIM ADI", cell: (vat) => vat.name },
    { id: "rate", header: "KDV ORANI", cell: (vat) => `%${vat.rate}` },
    { id: "default", header: "VARSAYILAN", align: "center", cell: (vat) => (vat.isDefault ? <Badge>Varsayılan</Badge> : null) },
    {
      id: "actions",
      header: "İŞLEM",
      align: "right",
      cell: (vat) => (
        <RowActions name={vat.name} onEdit={() => dialog.openEdit(vat)} onDelete={() => handleDelete(vat)} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Percent}
          title="Kdv Oranları"
          description={`Ürün gruplarınıza ait KDV oranlarını bu alandan yönetebilirsiniz. Tanımları düzenleyebilir, yeni oranlar ekleyebilir veya ihtiyaç duymadıklarınızı kaldırabilirsiniz. Toplamda en fazla ${MAX_VAT_DEFINITIONS} farklı KDV tanımı oluşturabilirsiniz.`}
          actions={
            <Button onClick={dialog.openCreate} disabled={vats.length >= MAX_VAT_DEFINITIONS}>
              <Plus />
              Yeni KDV Grubu Ekle
            </Button>
          }
        />
        <PageBody>
          <DataTable
            columns={columns}
            rows={vats}
            getRowId={(vat) => vat.id}
            caption="KDV grupları"
            emptyMessage="Kayıt bulunamadı. Lütfen yeni bir KDV grubu ekleyin."
          />
        </PageBody>
      </PageCard>

      <VatFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        vat={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
