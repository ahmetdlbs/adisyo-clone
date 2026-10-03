"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import {
  DISCOUNT_TYPE_OPTIONS,
  discountFormSchema,
  type Discount,
  type DiscountFormInput,
  type DiscountFormValues,
} from "../model/discount";

interface DiscountFormDialogProps {
  open: boolean;
  /** The discount being edited, or null when creating. */
  discount: Discount | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: DiscountFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this discount's values. */
export function DiscountFormDialog({ open, discount, onOpenChange, onSave }: DiscountFormDialogProps) {
  const form = useForm<DiscountFormInput, unknown, DiscountFormValues>({
    resolver: zodResolver(discountFormSchema),
    defaultValues: {
      name: discount?.name ?? "",
      type: discount?.type ?? "percent",
      amount: discount ? String(discount.amount) : "",
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="İndirim Tanımla"
      description={discount ? "İndirim bilgilerini güncelleyiniz." : "Yeni indirim bilgilerini giriniz."}
      submitLabel={discount ? "Kaydet" : "Ekle"}
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="name" label="İndirim Adı" required autoFocus />
      <SelectField control={form.control} name="type" label="İndirim Tipi" options={DISCOUNT_TYPE_OPTIONS} required />
      <TextField
        control={form.control}
        name="amount"
        label="İndirim Tutarı"
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        required
      />
    </FormDialog>
  );
}
