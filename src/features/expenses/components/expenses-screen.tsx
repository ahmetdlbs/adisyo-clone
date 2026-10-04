"use client";

import { useState } from "react";
import { Download, ListFilter, Plus, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer, PageToolbar } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { SearchInput } from "@/components/kit/search-input";
import { TablePagination } from "@/components/kit/table-pagination";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { usePagination } from "@/hooks/use-pagination";
import { formatClock } from "@/lib/format";
import { formatKurus } from "@/lib/money";
import { downloadCsv, kurusCell } from "@/lib/csv";
import { notifyUnavailable } from "@/lib/notify";
import { filterByQuery } from "@/lib/search";
import { EXPENSE_PAYMENT_METHODS, expenseSearchText, type Expense, type ExpenseFormValues } from "../model/expense";
import { createExpense } from "../server/actions";
import { ExpenseFormDialog } from "./expense-form-dialog";

const methodLabel = (method: Expense["paymentMethod"]) => EXPENSE_PAYMENT_METHODS.find((option) => option.value === method)?.label ?? method;

export function ExpensesScreen({ expenses }: { expenses: readonly Expense[] }) {
  const [query, setQuery] = useState("");
  const dialog = useEntityDialog<never>();

  const pager = usePagination(filterByQuery(expenses, query, expenseSearchText));

  const handleExport = () =>
    downloadCsv(
      "masraflar.csv",
      ["Masraf Tipi", "Tarih", "Ödeme Tipi", "Tutar", "Not"],
      filterByQuery(expenses, query, expenseSearchText).map((expense) => [
        expense.type,
        expense.occurredAt,
        methodLabel(expense.paymentMethod),
        kurusCell(expense.amount),
        expense.note,
      ]),
    );

  const handleSave = async (values: ExpenseFormValues) => {
    await createExpense(values);
    toast.success("Masraf eklendi");
    dialog.close();
  };

  const columns: readonly DataTableColumn<Expense>[] = [
    { id: "type", header: "Masraf Tipi", cell: (expense) => expense.type },
    { id: "date", header: "Masraf Tarihi", cell: (expense) => formatClock(expense.occurredAt) },
    { id: "method", header: "Ödeme Tipi", cell: (expense) => methodLabel(expense.paymentMethod) },
    { id: "amount", header: "Tutar", align: "right", cell: (expense) => formatKurus(expense.amount) },
    { id: "note", header: "Masraf Detayı", cell: (expense) => expense.note || "-" },
  ];

  return (
    <PageContainer className="max-w-7xl">
      <PageCard>
        <PageHeader
          className="p-6"
          icon={TrendingDown}
          title="Gider ve Masraflar"
          description="Gider ve masraflarınızı bu sayfadan yönetebilirsiniz."
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={handleExport}>
                <Download />
                İndir
              </Button>
              <Button variant="ghost" onClick={notifyUnavailable}>
                <ListFilter />
                Masraf Tiplerini Düzenle
              </Button>
              <Button onClick={dialog.openCreate}>
                <Plus />
                Masraf Ekle
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
            placeholder="Masraf tipi veya açıklama ile ara"
            aria-label="Masraf Arama"
          />
        </PageToolbar>
        <PageBody className="pt-4">
          <DataTable
            columns={columns}
            rows={pager.pageItems}
            getRowId={(expense) => expense.id}
            caption="Giderler"
            emptyMessage="Herhangi bir sonuç bulunamadı, farklı filtreler deneyerek aramanızı genişletebilirsiniz."
          />
        </PageBody>
        <TablePagination page={pager.page} pageCount={pager.pageCount} onPageChange={pager.setPage} />
      </PageCard>

      <ExpenseFormDialog key={dialog.session} open={dialog.isOpen} onOpenChange={dialog.onOpenChange} onSave={handleSave} />
    </PageContainer>
  );
}
