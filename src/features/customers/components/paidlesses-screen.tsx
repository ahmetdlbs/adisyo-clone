"use client";

import { useState } from "react";
import { ArrowDownUp, Download, Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { SearchInput } from "@/components/kit/search-input";
import { TablePagination } from "@/components/kit/table-pagination";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { usePagination } from "@/hooks/use-pagination";
import { removeById } from "@/lib/collection";
import { notifyUnavailable } from "@/lib/notify";
import { filterByQuery } from "@/lib/search";
import { formatPaidlessNo, paidlessSearchText, savePaidless, type Paidless, type PaidlessFormValues } from "../model/paidless";
import { PaidlessFormDialog } from "./paidless-form-dialog";

const nameOf = (item: Paidless) => `${item.firstName} ${item.lastName}`.trim();

export function PaidlessesScreen({ initialItems = [] }: { initialItems?: readonly Paidless[] }) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const dialog = useEntityDialog<Paidless>();

  const pager = usePagination(filterByQuery(items, query, paidlessSearchText));

  const handleSave = (values: PaidlessFormValues) => {
    // savePaidless throws when the person is already listed; the form shows the message and stays open.
    setItems(savePaidless(items, { id: dialog.editing?.id ?? null, ...values }, () => crypto.randomUUID()));
    toast.success(dialog.editing ? "Ödenmez güncellendi" : "Ödenmez eklendi");
    dialog.close();
  };

  const handleDelete = (item: Paidless) => {
    setItems((current) => removeById(current, item.id));
    toast.success("Ödenmez silindi");
  };

  const columns: readonly DataTableColumn<Paidless>[] = [
    { id: "no", header: "No", cell: (item) => formatPaidlessNo(item.no) },
    { id: "name", header: "Ad Soyad", cell: nameOf },
    { id: "title", header: "Unvan", cell: (item) => item.title || "-" },
    {
      id: "actions",
      header: "İşlemler",
      align: "right",
      cell: (item) => <RowActions name={nameOf(item)} onEdit={() => dialog.openEdit(item)} onDelete={() => handleDelete(item)} />,
    },
  ];

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Users}
          title="Ödenmezler"
          description={`Ödenmez Sayısı: ${items.length}`}
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Download />
                İndir
              </Button>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <ArrowDownUp />
                Kullanıcıları Aktar
              </Button>
              <Button onClick={dialog.openCreate}>
                <Plus />
                Ekle
              </Button>
            </>
          }
        />
        <PageToolbar>
          <SearchInput
            className="w-80"
            value={query}
            onValueChange={(next) => {
              setQuery(next);
              pager.reset();
            }}
            placeholder="Ad veya numara ile ara"
            aria-label="Ödenmez Arama"
          />
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={pager.pageItems}
            getRowId={(item) => item.id}
            caption="Ödenmezler"
            emptyMessage={query ? "Arama kriterlerine uygun kayıt bulunamadı." : "Hiç ödenmez kaydı bulunamadı."}
          />
        </PageBody>
        <TablePagination page={pager.page} pageCount={pager.pageCount} onPageChange={pager.setPage} />
      </PageCard>

      <PaidlessFormDialog key={dialog.session} open={dialog.isOpen} paidless={dialog.editing} onOpenChange={dialog.onOpenChange} onSave={handleSave} />
    </PageContainer>
  );
}
