"use client";

import { Percent, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { MAX_VAT_DEFINITIONS, type VatDefinition, type VatFormValues } from "../model/vat";
import { createVat, deleteVat, updateVat } from "../server/vat-actions";
import { VatFormDialog } from "./vat-form-dialog";

export function VatScreen({ vats }: { vats: readonly VatDefinition[] }) {
  const dialog = useEntityDialog<VatDefinition>();

  const handleSave = async (values: VatFormValues) => {
    if (dialog.editing) {
      await updateVat(dialog.editing.id, values);
      toast.success("KDV grubu güncellendi");
    } else {
      await createVat(values);
      toast.success("KDV grubu eklendi");
    }
    dialog.close();
  };

  const handleDelete = (vat: VatDefinition) => {
    deleteVat(vat.id)
      .then(() => toast.success("KDV grubu silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "KDV grubu silinemedi"));
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
