"use client";

import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { saveUser, type User, type UserFormValues } from "../model/user";
import { UserFormDialog } from "./user-form-dialog";

export function UsersScreen({ initialUsers = [] }: { initialUsers?: readonly User[] }) {
  const [users, setUsers] = useState(initialUsers);
  const dialog = useEntityDialog<never>();

  const handleSave = (values: UserFormValues) => {
    // saveUser throws when the phone number is already registered; the form shows the message and stays open.
    setUsers(saveUser(users, values, () => crypto.randomUUID()));
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
