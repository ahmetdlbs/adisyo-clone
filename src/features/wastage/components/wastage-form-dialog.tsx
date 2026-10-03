"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import type { StockItem } from "@/features/stock/model/stock-item";
import { wastageFormSchema, type WastageFormInput, type WastageFormValues } from "../model/wastage";

const localNow = () => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

interface WastageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: WastageFormValues) => Promise<void>;
  /** Stock cards a loss can be taken off; none means the stock fields are left out. */
  stockItems?: readonly StockItem[];
}

/** Mount with a new `key` per opening so the form starts blank each time. */
export function WastageFormDialog({ open, onOpenChange, onSave, stockItems = [] }: WastageFormDialogProps) {
  const form = useForm<WastageFormInput, unknown, WastageFormValues>({
    resolver: zodResolver(wastageFormSchema),
    defaultValues: { productName: "", reason: "", quantity: "1", cost: "", occurredAt: localNow(), responsible: "", stockItemId: "", stockQuantity: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Zayi eklenemedi");
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Zayi Ekle"
      description="Bu pencereden zayi ekleyebilirsiniz."
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField control={form.control} name="productName" label="Ürün" required autoFocus />
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="quantity" label="Miktar" inputMode="numeric" required />
        <TextField control={form.control} name="cost" label="Maliyet tutarı (₺)" inputMode="decimal" required />
      </div>
      <TextField control={form.control} name="occurredAt" label="Zayi Tarihi" type="datetime-local" required />
      <TextField control={form.control} name="reason" label="Zayi nedeni" required />
      <TextField control={form.control} name="responsible" label="Sorumlu Kişi" required />
      {stockItems.length > 0 && (
        <div className="grid grid-cols-[1fr_8rem] items-start gap-4">
          <SelectField
            control={form.control}
            name="stockItemId"
            label="Stoktan düş (isteğe bağlı)"
            options={stockItems.map((item) => ({ value: item.id, label: `${item.name} (${item.unitName})` }))}
          />
          <TextField control={form.control} name="stockQuantity" label="Miktar" inputMode="decimal" />
        </div>
      )}
    </FormDialog>
  );
}
