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
import { removeById, upsertById } from "@/lib/collection";
import { filterByQuery } from "@/lib/search";
import { INITIAL_FEATURE_GROUPS } from "../data/feature-groups";
import { SELECTION_TYPE_OPTIONS, type FeatureGroup, type FeatureGroupFormValues } from "../model/feature-group";
import { FeatureGroupSheet } from "./feature-group-sheet";

const selectionLabel = (group: FeatureGroup) =>
  SELECTION_TYPE_OPTIONS.find((option) => option.value === group.selectionType)?.label ?? group.selectionType;

export function FeaturesScreen({ initialGroups = INITIAL_FEATURE_GROUPS }: { initialGroups?: readonly FeatureGroup[] }) {
  const [groups, setGroups] = useState(initialGroups);
  const [query, setQuery] = useState("");
  const dialog = useEntityDialog<FeatureGroup>();

  const handleSave = (values: FeatureGroupFormValues) => {
    setGroups((current) => upsertById(current, { id: dialog.editing?.id ?? crypto.randomUUID(), ...values }));
    toast.success(dialog.editing ? "Özellik grubu güncellendi" : "Özellik grubu eklendi");
    dialog.close();
  };

  const handleDelete = (group: FeatureGroup) => {
    setGroups((current) => removeById(current, group.id));
    toast.success("Özellik grubu silindi");
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
        groups={groups}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
