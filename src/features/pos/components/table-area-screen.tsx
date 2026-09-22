"use client";

import { useState } from "react";
import { LayoutGrid, ListOrdered, Plus, Rows3 } from "lucide-react";
import { toast } from "sonner";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { cn } from "@/lib/utils";
import { areaFormSchema } from "../model/definition-forms";
import { addTables, deleteArea, deleteTable, moveArea, saveArea, saveTable } from "../model/floor-plan";
import type { TableDefinition } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";
import { BulkTablesDialog } from "./bulk-tables-dialog";
import { ManageListDialog } from "./manage-list-dialog";
import { TableFormDialog } from "./table-form-dialog";

/** Floor-plan editor: the areas of the restaurant and the tables in each. Feeds the POS floor view. */
export function TableAreaScreen() {
  const state = usePosState();
  const actions = usePosActions();
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [isAreasOpen, setIsAreasOpen] = useState(false);
  const [bulkSession, setBulkSession] = useState(0);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const tableDialog = useEntityDialog<TableDefinition>();

  const areaId = state.areas.some((area) => area.id === selectedAreaId) ? (selectedAreaId ?? "") : (state.areas[0]?.id ?? "");
  const tables = state.tables.filter((table) => table.areaId === areaId);
  const newId = () => crypto.randomUUID();

  const removeTable = (table: TableDefinition) => {
    try {
      actions.change((current) => deleteTable(current, table.id));
      toast.success("Masa silindi");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Masa silinemedi");
    }
  };

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={LayoutGrid}
          title="Masa / Bölgeler"
          description="Restoranınıza ait masa ve bölgeleri bu ekrandan düzenleyebilirsiniz."
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={() => setIsAreasOpen(true)}>
                <ListOrdered />
                Bölgeleri Yönet
              </Button>
              <Button
                variant="ghost"
                className="text-primary"
                disabled={state.areas.length === 0}
                onClick={() => {
                  setBulkSession((current) => current + 1);
                  setIsBulkOpen(true);
                }}
              >
                <Rows3 />
                Toplu Masa Ekle
              </Button>
              <Button disabled={state.areas.length === 0} onClick={tableDialog.openCreate}>
                <Plus />
                Yeni Masa
              </Button>
            </>
          }
        />

        <PageBody className="flex flex-col gap-4 px-6">
          {state.areas.length === 0 ? (
            <p className="py-10 text-center text-muted-foreground">Henüz bölge yok. &ldquo;Bölgeleri Yönet&rdquo; ile ilk bölgeyi ekleyin.</p>
          ) : (
            <>
              <Tabs value={areaId} onValueChange={(value) => setSelectedAreaId(String(value))}>
                <TabsList variant="line">
                  {state.areas.map((area) => (
                    <TabsTrigger key={area.id} value={area.id}>
                      {area.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <ul aria-label="Masalar" className="grid grid-cols-2 gap-4 rounded-lg bg-muted/60 p-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
                {tables.length === 0 && <li className="col-span-full text-center text-sm text-muted-foreground">Bu bölgede masa yok.</li>}
                {tables.map((table) => (
                  <li
                    key={table.id}
                    className={cn(
                      "flex h-28 flex-col items-center justify-between border bg-card p-2 shadow-sm",
                      table.shape === "circle" ? "rounded-3xl" : "rounded-md"
                    )}
                  >
                    <div className="self-end">
                      <RowActions name={table.name} onEdit={() => tableDialog.openEdit(table)} onDelete={() => removeTable(table)} />
                    </div>
                    <span className="pb-3 text-sm font-medium">{table.name}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </PageBody>
      </PageCard>

      <TableFormDialog
        key={tableDialog.session}
        open={tableDialog.isOpen}
        table={tableDialog.editing}
        areas={state.areas}
        defaultAreaId={areaId}
        onOpenChange={tableDialog.onOpenChange}
        onSave={(values) => {
          actions.change((current) => saveTable(current, { id: tableDialog.editing?.id ?? null, ...values }, newId));
          toast.success(tableDialog.editing ? "Masa güncellendi" : "Masa eklendi");
          tableDialog.close();
        }}
      />

      <BulkTablesDialog
        key={bulkSession}
        open={isBulkOpen}
        areas={state.areas}
        defaultAreaId={areaId}
        onOpenChange={setIsBulkOpen}
        onSave={(values) => {
          actions.change((current) => addTables(current, values, newId));
          toast.success(values.count === 1 ? "Masa eklendi" : `${values.count} masa eklendi`);
          setIsBulkOpen(false);
        }}
      />

      <ManageListDialog
        open={isAreasOpen}
        onOpenChange={setIsAreasOpen}
        title="Bölgeleri Yönet"
        description="Bölge ekleyin, adını değiştirin, silin veya sekme sırasını değiştirin."
        noun="Bölge"
        schema={areaFormSchema}
        items={state.areas}
        onSave={({ id, name }) => {
          actions.change((current) => saveArea(current, { id, name }, newId));
          toast.success(id ? "Bölge güncellendi" : "Bölge eklendi");
        }}
        onDelete={(id) => {
          actions.change((current) => deleteArea(current, id));
          toast.success("Bölge silindi");
        }}
        onMove={(id, offset) => actions.change((current) => moveArea(current, id, offset))}
      />
    </PageContainer>
  );
}
