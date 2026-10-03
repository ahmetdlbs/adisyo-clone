"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import {
  adjustStockFormSchema,
  type AdjustStockFormInput,
  type AdjustStockFormValues,
  type StockItem,
} from "../model/stock-item";

interface StockAdjustDialogProps {
  open: boolean;
  /** The stock item being adjusted; null while the dialog is closed. */
  item: StockItem | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the entry; its message is shown on the amount field. */
  onSave: (values: AdjustStockFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the amount always starts blank. */
export function StockAdjustDialog({
  open,
  item,
  onOpenChange,
  onSave,
}: StockAdjustDialogProps) {
  const form = useForm<AdjustStockFormInput, unknown, AdjustStockFormValues>({
    resolver: zodResolver(adjustStockFormSchema),
    defaultValues: { delta: "" },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      form.setError("delta", {
        message: error instanceof Error ? error.message : "Kaydedilemedi",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Stok Girişi / Çıkışı"
      description={
        item
          ? `"${item.name}" için mevcut stok: ${item.quantity} ${item.unitName}.`
          : undefined
      }
      submitLabel="Kaydet"
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField
        control={form.control}
        name="delta"
        label="Miktar"
        inputMode="decimal"
        placeholder="Ekleme için pozitif, çıkış için negatif giriniz"
        description="Örn. yeni alım için 10, fire için -2."
        required
        autoFocus
      />
    </FormDialog>
  );
}
