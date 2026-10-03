"use client";

import { useState } from "react";
import { ListChecks, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { SearchInput } from "@/components/kit/search-input";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { filterByQuery } from "@/lib/search";
import { SELECTION_TYPE_OPTIONS, type FeatureGroup, type FeatureGroupFormValues } from "../model/feature-group";
import { createFeatureGroup, deleteFeatureGroup, updateFeatureGroup } from "../server/feature-group-actions";
import { FeatureGroupSheet } from "./feature-group-sheet";

const selectionLabel = (group: FeatureGroup) =>
  SELECTION_TYPE_OPTIONS.find((option) => option.value === group.selectionType)?.label ?? group.selectionType;

export function FeaturesScreen({ groups }: { groups: readonly FeatureGroup[] }) {
  const [query, setQuery] = useState("");
  const dialog = useEntityDialog<FeatureGroup>();

  const handleSave = async (values: FeatureGroupFormValues) => {
    if (dialog.editing) {
      await updateFeatureGroup(dialog.editing.id, values);
      toast.success("Özellik grubu güncellendi");
    } else {
      await createFeatureGroup(values);
      toast.success("Özellik grubu eklendi");
    }
    dialog.close();
  };

  const handleDelete = (group: FeatureGroup) => {
    deleteFeatureGroup(group.id)
      .then(() => toast.success("Özellik grubu silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Özellik grubu silinemedi"));
  };

  const columns: readonly DataTableColumn<FeatureGroup>[] = [
    { id: "name", header: "Özellik grup ismi", cell: (group) => group.name },
    { id: "type", header: "Seçim tipi", cell: selectionLabel },
    { id: "options", header: "Özellikler", cell: (group) => <span className="font-medium text-primary">{group.options.length}</span> },
    {
      id: "actions",
      header: "İşlemler",
      align: "right",
      cell: (group) => (
        <RowActions name={group.name} onEdit={() => dialog.openEdit(group)} onDelete={() => handleDelete(group)} />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageCard>
        <PageHeader
          className="p-6"
          icon={ListChecks}
          title="Özellikler"
          description="Ürünlere atanabilecek özellik gruplarını (ör. pişirme derecesi, ekstra malzeme) ve seçeneklerini buradan yönetebilirsiniz."
        />
        <PageToolbar>
          <SearchInput className="w-80" value={query} onValueChange={setQuery} placeholder="Arama..." />
          <Button onClick={dialog.openCreate}>
            <Plus />
            Yeni Grup Tanımla
          </Button>
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={filterByQuery(groups, query, (group) => group.name)}
            getRowId={(group) => group.id}
            caption="Özellik grupları"
            emptyMessage="Kayıt bulunamadı."
          />
        </PageBody>
      </PageCard>

      <FeatureGroupSheet
        key={dialog.session}
        open={dialog.isOpen}
        group={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
