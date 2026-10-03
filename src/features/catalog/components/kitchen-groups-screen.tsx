"use client";

import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/config/routes";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { kitchenStages, type KitchenGroup, type KitchenGroupFormValues } from "../model/kitchen-group";
import { createKitchenGroup, deleteKitchenGroup, updateKitchenGroup } from "../server/kitchen-group-actions";
import { KitchenGroupFormDialog } from "./kitchen-group-form-dialog";

export function KitchenGroupsScreen({ groups }: { groups: readonly KitchenGroup[] }) {
  const dialog = useEntityDialog<KitchenGroup>();

  const handleSave = async (values: KitchenGroupFormValues) => {
    if (dialog.editing) {
      await updateKitchenGroup(dialog.editing.id, values);
      toast.success("Mutfak grubu güncellendi");
    } else {
      await createKitchenGroup(values);
      toast.success("Mutfak grubu eklendi");
    }
    dialog.close();
  };

  const handleDelete = (group: KitchenGroup) => {
    deleteKitchenGroup(group.id)
      .then(() => toast.success("Mutfak grubu silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Mutfak grubu silinemedi"));
  };

  const columns: readonly DataTableColumn<KitchenGroup>[] = [
    { id: "name", header: "GRUP ADI", cell: (group) => group.name },
    { id: "stages", header: "MUTFAK DURUMU", cell: (group) => kitchenStages(group).join(" › ") },
    {
      id: "actions",
      header: "İŞLEMLER",
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
          icon={FileText}
          title="Mutfak Grubu Tanımları"
          description={
            <>
              Bu ekranda işletmenizdeki mutfak grupları (ör. mutfak, bar, fırın, nargile) tanımlanır. Daha sonra{" "}
              <Link href={ROUTES.productDefinition} className="text-primary hover:underline">
                Menü/Ürünler
              </Link>{" "}
              ekranında ilgili ürün seçilerek, tanımlanan mutfak grubu atanır. (Örneğin &lsquo;İçecek&rsquo; adında bir
              mutfak grubu tanımlanıp kola ürününün mutfak grubu &lsquo;İçecek&rsquo; olarak güncellenirse, kola siparişi
              içecek bölümündeki ekrana veya yazıcıya gönderilir.)
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
          <Alert className="mb-4">
            <AlertDescription>
              Tüm mutfak gruplarında varsayılan <b>Mutfak Durumu &lsquo;Hazırlanıyor ve Hazırlandı&rsquo;</b> olarak
              atanmıştır. Eğer mutfakta pişirme ve paketleme aşamaları varsa düzenle bölümünden bu kısımları da dahil
              edebilirsiniz.
            </AlertDescription>
          </Alert>
          <DataTable
            columns={columns}
            rows={groups}
            getRowId={(group) => group.id}
            caption="Mutfak grupları"
            emptyMessage="Hiç mutfak grubu kaydı bulunamadı."
          />
        </PageBody>
      </PageCard>

      <KitchenGroupFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        group={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
