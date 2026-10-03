"use client";

import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import type { User, UserFormValues } from "../model/user";
import { createStaffMember } from "../server/actions";
import { UserFormDialog } from "./user-form-dialog";

export function UsersScreen({ users }: { users: readonly User[] }) {
  const dialog = useEntityDialog<never>();

  const handleSave = async (values: UserFormValues) => {
    // createStaffMember throws when the phone number is already registered; the form shows the message and stays open.
    await createStaffMember(values);
    toast.success("Kullanıcı eklendi");
    dialog.close();
  };

  const columns: readonly DataTableColumn<User>[] = [
    { id: "no", header: "No", cell: (user) => user.no },
    { id: "name", header: "Ad/Soyad", cell: (user) => user.name },
    { id: "email", header: "Email", cell: (user) => user.email || "-" },
    { id: "phone", header: "Telefon", cell: (user) => user.phone },
    { id: "role", header: "Görev", cell: (user) => user.role },
    { id: "lastLogin", header: "Son Giriş / Çıkış Tarihi", cell: (user) => user.lastLogin ?? "- / -" },
  ];

  return (
    <PageContainer className="max-w-6xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Users}
          title="Kullanıcılar"
          description={`Kullanıcı Sayısı : ${users.length}`}
          actions={
            <Button onClick={dialog.openCreate}>
              <Plus />
              Ekle
            </Button>
          }
        />
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={[...users].sort((a, b) => a.no - b.no)}
            getRowId={(user) => user.id}
            caption="Kullanıcılar"
            emptyMessage="Hiç kullanıcı bulunamadı."
          />
        </PageBody>
      </PageCard>

      <UserFormDialog key={dialog.session} open={dialog.isOpen} onOpenChange={dialog.onOpenChange} onSave={handleSave} />
    </PageContainer>
  );
}
