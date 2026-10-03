"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { toAmountText } from "@/lib/money";
import type { Unit } from "@/features/catalog/model/unit";
import {
  stockItemFormSchema,
  type StockItem,
  type StockItemFormInput,
  type StockItemFormValues,
} from "../model/stock-item";

interface StockItemFormDialogProps {
  open: boolean;
  /** The stock item being edited, or null when creating. */
  item: StockItem | null;
  units: readonly Unit[];
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the stock item; its message is shown on the name field. */
  onSave: (values: StockItemFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this item's values. */
export function StockItemFormDialog({
  open,
  item,
  units,
  onOpenChange,
  onSave,
}: StockItemFormDialogProps) {
  const form = useForm<StockItemFormInput, unknown, StockItemFormValues>({
    resolver: zodResolver(stockItemFormSchema),
    defaultValues: {
      name: item?.name ?? "",
      unitId: item?.unitId ?? "",
      quantity: item ? String(item.quantity) : "",
      unitCost: item?.unitCost !== undefined ? toAmountText(item.unitCost) : "",
      criticalLevel:
        item?.criticalLevel !== undefined ? String(item.criticalLevel) : "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      form.setError("name", {
        message: error instanceof Error ? error.message : "Kaydedilemedi",
      });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Stok Kartı Tanımla"
      description={
        item
          ? "Stok kartı bilgilerini güncelleyiniz."
          : "Yeni stok kartı bilgilerini giriniz."
      }
      submitLabel={item ? "Güncelle" : "Ekle"}
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField
        control={form.control}
        name="name"
        label="Stok Kartı Adı"
        required
        autoFocus
      />
      <SelectField
        control={form.control}
        name="unitId"
        label="Birim"
        required
        options={units.map((unit) => ({ value: unit.id, label: unit.name }))}
      />
      <TextField
        control={form.control}
        name="quantity"
        label="Mevcut Stok"
        inputMode="decimal"
        placeholder="0"
        required
      />
      <TextField
        control={form.control}
        name="unitCost"
        label="Birim Maliyeti (₺)"
        inputMode="decimal"
        placeholder="0,00"
        description="Bir birimin alış fiyatı; stok değerini hesaplamakta kullanılır."
      />
      <TextField
        control={form.control}
        name="criticalLevel"
        label="Kritik Seviye"
        inputMode="decimal"
        placeholder="0"
        description="Bu seviyeye inince stok listesinde düşük stok olarak işaretlenir."
      />
    </FormDialog>
  );
}
