"use client";

import Link from "next/link";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import type { Unit, UnitFormValues } from "../model/unit";
import { createUnit, deleteUnit, updateUnit } from "../server/unit-actions";
import { UnitFormDialog } from "./unit-form-dialog";

export function UnitsScreen({ units }: { units: readonly Unit[] }) {
  const dialog = useEntityDialog<Unit>();

  const handleSave = async (values: UnitFormValues) => {
    if (dialog.editing) {
      await updateUnit(dialog.editing.id, values);
      toast.success("Birim güncellendi");
    } else {
      await createUnit(values);
      toast.success("Birim eklendi");
    }
    dialog.close();
  };

  const handleDelete = (unit: Unit) => {
    deleteUnit(unit.id)
      .then(() => toast.success("Birim silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Birim silinemedi"));
  };

  const columns: readonly DataTableColumn<Unit>[] = [
    { id: "name", header: "BİRİM ADI", cell: (unit) => unit.name },
    {
      id: "actions",
      header: "İŞLEMLER",
      align: "right",
      cell: (unit) => (
        <RowActions name={unit.name} onEdit={() => dialog.openEdit(unit)} onDelete={() => handleDelete(unit)} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Receipt}
          title="Porsiyon/Birim Yönetimi"
          description={
            <>
              Bu ekranda ürünler için kullanılacak porsiyonlar (örneğin tam, yarım, double vb.) tanımlanır. Ardından{" "}
              <Link href={ROUTES.productDefinition} className="text-primary hover:underline">
                Menü/Ürünler
              </Link>{" "}
              ekranında ilgili ürün seçilerek, bu porsiyonlardan istenen ürüne atanır. Böylece aynı ürün farklı
              porsiyon seçenekleriyle satışa sunulabilir.
            </>
          }
          actions={
            <Button onClick={dialog.openCreate}>
              <Plus />
              Yeni
            </Button>
          }
        />
        <PageBody>
          <DataTable columns={columns} rows={units} getRowId={(unit) => unit.id} caption="Birimler" />
        </PageBody>
      </PageCard>

      <UnitFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        unit={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
