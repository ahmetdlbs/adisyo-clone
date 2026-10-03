"use client";

import { Plus, Utensils } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import type { CourseGroup, CourseGroupFormValues } from "../model/course-group";
import { createCourseGroup, deleteCourseGroup, updateCourseGroup } from "../server/course-group-actions";
import { CourseGroupFormDialog } from "./course-group-form-dialog";

export function CourseGroupsScreen({ groups }: { groups: readonly CourseGroup[] }) {
  const dialog = useEntityDialog<CourseGroup>();

  const handleSave = async (values: CourseGroupFormValues) => {
    if (dialog.editing) {
      await updateCourseGroup(dialog.editing.id, values);
      toast.success("Marş grubu güncellendi");
    } else {
      await createCourseGroup(values);
      toast.success("Marş grubu eklendi");
    }
    dialog.close();
  };

  const handleDelete = (group: CourseGroup) => {
    deleteCourseGroup(group.id)
      .then(() => toast.success("Marş grubu silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Marş grubu silinemedi"));
  };

  const columns: readonly DataTableColumn<CourseGroup>[] = [
    { id: "name", header: "GRUP ADI", cell: (group) => group.name },
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
          icon={Utensils}
          title="Marş Grupları"
          description="Ürünlerin mutfaktan hangi sırayla (marşla) çıkacağını gruplamak için burada tanımlayın."
          actions={
            <Button onClick={dialog.openCreate}>
              <Plus />
              Yeni
            </Button>
          }
        />
        <PageBody>
          <DataTable columns={columns} rows={groups} getRowId={(group) => group.id} caption="Marş Grupları" />
        </PageBody>
      </PageCard>

      <CourseGroupFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        group={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
