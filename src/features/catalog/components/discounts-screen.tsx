"use client";

import { useState } from "react";
import { Download, Plus, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { removeById, upsertById } from "@/lib/collection";
import { notifyUnavailable } from "@/lib/notify";
import { INITIAL_DISCOUNTS } from "../data/discounts";
import { DISCOUNT_TYPE_OPTIONS, formatDiscountValue, type Discount, type DiscountFormValues } from "../model/discount";
import { DiscountFormDialog } from "./discount-form-dialog";

const typeLabel = (discount: Discount) =>
  DISCOUNT_TYPE_OPTIONS.find((option) => option.value === discount.type)?.label ?? discount.type;

export function DiscountsScreen({ initialDiscounts = INITIAL_DISCOUNTS }: { initialDiscounts?: readonly Discount[] }) {
  const [discounts, setDiscounts] = useState(initialDiscounts);
  const dialog = useEntityDialog<Discount>();

  const handleSave = (values: DiscountFormValues) => {
    setDiscounts((current) => upsertById(current, { id: dialog.editing?.id ?? crypto.randomUUID(), ...values }));
    toast.success(dialog.editing ? "İndirim güncellendi" : "İndirim eklendi");
    dialog.close();
  };

  const handleDelete = (discount: Discount) => {
    setDiscounts((current) => removeById(current, discount.id));
    toast.success("İndirim silindi");
  };

  const columns: readonly DataTableColumn<Discount>[] = [
    { id: "name", header: "İndirim Adı", cell: (discount) => discount.name },
    { id: "type", header: "İndirim Türü", cell: typeLabel },
    { id: "amount", header: "İndirim Tutarı", cell: formatDiscountValue },
    {
      id: "actions",
      header: "Düzenle / Sil",
      align: "right",
      cell: (discount) => (
        <RowActions
          name={discount.name}
          onEdit={() => dialog.openEdit(discount)}
          onDelete={() => handleDelete(discount)}
        />
      ),
    },
  ];

  return (
    <PageContainer>
      <PageCard>
        <PageHeader
          className="p-6"
          icon={TrendingDown}
          title="İndirimler"
          description="Tanımlı indirimleri buradan görebilir ve yeni indirim tanımlayabilirsiniz."
          actions={
            <>
              <Button variant="ghost" className="text-primary" onClick={notifyUnavailable}>
                <Download />
                İndir
              </Button>
              <Button onClick={dialog.openCreate}>
                <Plus />
                Yeni
              </Button>
            </>
          }
        />
        <PageBody>
          <DataTable
            columns={columns}
            rows={discounts}
            getRowId={(discount) => discount.id}
            caption="İndirimler"
            emptyMessage="Hiç indirim kaydı bulunamadı."
          />
        </PageBody>
      </PageCard>

      <DiscountFormDialog
        key={dialog.session}
        open={dialog.isOpen}
        discount={dialog.editing}
        onOpenChange={dialog.onOpenChange}
        onSave={handleSave}
      />
    </PageContainer>
  );
}
