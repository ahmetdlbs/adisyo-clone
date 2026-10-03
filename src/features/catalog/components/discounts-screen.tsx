"use client";

import { Download, Plus, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { PageBody, PageCard, PageContainer } from "@/components/kit/page";
import { PageHeader } from "@/components/kit/page-header";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { useEntityDialog } from "@/hooks/use-entity-dialog";
import { notifyUnavailable } from "@/lib/notify";
import { DISCOUNT_TYPE_OPTIONS, formatDiscountValue, type Discount, type DiscountFormValues } from "../model/discount";
import { createDiscount, deleteDiscount, updateDiscount } from "../server/discount-actions";
import { DiscountFormDialog } from "./discount-form-dialog";

const typeLabel = (discount: Discount) =>
  DISCOUNT_TYPE_OPTIONS.find((option) => option.value === discount.type)?.label ?? discount.type;

export function DiscountsScreen({ discounts }: { discounts: readonly Discount[] }) {
  const dialog = useEntityDialog<Discount>();

  const handleSave = async (values: DiscountFormValues) => {
    if (dialog.editing) {
      await updateDiscount(dialog.editing.id, values);
      toast.success("İndirim güncellendi");
    } else {
      await createDiscount(values);
      toast.success("İndirim eklendi");
    }
    dialog.close();
  };

  const handleDelete = (discount: Discount) => {
    deleteDiscount(discount.id)
      .then(() => toast.success("İndirim silindi"))
      .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "İndirim silinemedi"));
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
