"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import {
  VAT_RATE_OPTIONS,
  vatFormSchema,
  type VatDefinition,
  type VatFormInput,
  type VatFormValues,
} from "../model/vat";

interface VatFormDialogProps {
  open: boolean;
  /** The definition being edited, or null when creating. */
  vat: VatDefinition | null;
  onOpenChange: (open: boolean) => void;
  onSave: (values: VatFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this definition's values. */
export function VatFormDialog({ open, vat, onOpenChange, onSave }: VatFormDialogProps) {
  const form = useForm<VatFormInput, unknown, VatFormValues>({
    resolver: zodResolver(vatFormSchema),
    defaultValues: {
      name: vat?.name ?? "",
      rate: vat ? String(vat.rate) : "",
      isDefault: vat?.isDefault ?? false,
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="KDV Grubu Tanımla"
      description={vat ? "KDV grubu bilgilerini güncelleyiniz." : "Yeni KDV grubu bilgilerini giriniz."}
      submitLabel={vat ? "Kaydet" : "Ekle"}
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="name" label="Tanım Adı" placeholder="Örn: Yiyecek, İçecek" required autoFocus />
      <SelectField control={form.control} name="rate" label="KDV Oranı" options={VAT_RATE_OPTIONS} required />
      <SwitchField
        control={form.control}
        name="isDefault"
        label="Varsayılan"
        description="Yeni ürünlere otomatik atanır. Bir grup varsayılan olunca diğerlerinin işareti kalkar."
      />
    </FormDialog>
  );
}
