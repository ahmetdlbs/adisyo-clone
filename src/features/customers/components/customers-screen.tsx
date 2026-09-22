"use client";

import { useState } from "react";
import { Download, Plus, Upload, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { SearchInput } from "@/components/kit/search-input";
import { TablePagination } from "@/components/kit/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { usePagination } from "@/hooks/use-pagination";
import { removeById } from "@/lib/collection";
import { formatKurus } from "@/lib/money";
import { notifyUnavailable } from "@/lib/notify";
import { filterByQuery } from "@/lib/search";
import { customerSearchText, saveCustomer, totalBalance, type Customer, type CustomerFormValues } from "../model/customer";
import { CustomerFormDialog } from "./customer-form-dialog";

export function CustomersScreen({ initialCustomers = [] }: { initialCustomers?: readonly Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [query, setQuery] = useState("");
  const dialog = useEntityDialog<Customer>();

  const matching = filterByQuery(customers, query, customerSearchText);
  const pager = usePagination(matching);

  const handleSave = (values: CustomerFormValues) => {
    // saveCustomer throws when the phone number is taken; the form shows the message and stays open.
    setCustomers(saveCustomer(customers, { id: dialog.editing?.id ?? null, ...values }, () => crypto.randomUUID()));
    toast.success(dialog.editing ? "Müşteri güncellendi" : "Müşteri eklendi");
    dialog.close();
  };

  const handleDelete = (customer: Customer) => {
    setCustomers((current) => removeById(current, customer.id));
    toast.success("Müşteri silindi");
  };

  const handleQueryChange = (next: string) => {
    setQuery(next);
    pager.reset();
  };

  const columns: readonly DataTableColumn<Customer>[] = [
    { id: "no", header: "No", cell: (customer) => customer.no },
    { id: "name", header: "Ad Soyad", cell: (customer) => `${customer.firstName} ${customer.lastName}`.trim() },
    { id: "phone", header: "Telefon", cell: (customer) => customer.phone || "-" },
    {
      id: "openAccount",
      header: "Açık Hesap Müşterisi",
      align: "center",
      cell: (customer) => (customer.balance > 0 ? <Badge variant="secondary">Açık Hesap</Badge> : null),
    },
    { id: "balance", header: "Bakiye", align: "right", cell: (customer) => formatKurus(customer.balance) },
    {
      id: "actions",
      header: "İşlemler",
      align: "right",
      cell: (customer) => (
        <RowActions
          name={`${customer.firstName} ${customer.lastName}`.trim()}
          onEdit={() => dialog.openEdit(customer)}
          onDelete={() => handleDelete(customer)}
        />
      ),
    },
  ];

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={Users}
          title="Müşteriler"
          description={
            <>
              Müşteri Sayısı : {customers.length}
              <span className="ml-6">Toplam Bakiye : {formatKurus(totalBalance(customers))}</span>
            </>
          }
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Upload />
                Müşterileri Yükle
              </Button>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Download />
                İndir
              </Button>
              <Button onClick={dialog.openCreate}>
                <Plus />
                Ekle
              </Button>
            </>
          }
        />
        <PageToolbar>
          <SearchInput className="w-80" value={query} onValueChange={handleQueryChange} placeholder="Ad veya telefon ile ara" aria-label="Müşteri Arama" />
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={pager.pageItems}
            getRowId={(customer) => customer.id}
            caption="Müşteriler"
            emptyMessage={query ? "Arama kriterlerine uygun müşteri bulunamadı." : "Hiç müşteri kaydı bulunamadı."}
          />
        </PageBody>
        <TablePagination page={pager.page} pageCount={pager.pageCount} onPageChange={pager.setPage} />
      </PageCard>

      <CustomerFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        customer={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
