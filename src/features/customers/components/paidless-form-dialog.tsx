"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { paidlessFormSchema, type Paidless, type PaidlessFormValues } from "../model/paidless";

interface PaidlessFormDialogProps {
  open: boolean;
  /** The person being edited, or null when adding one. */
  paidless: Paidless | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to refuse the entry; its message is shown on the first-name field. */
  onSave: (values: PaidlessFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this person's values. */
export function PaidlessFormDialog({ open, paidless, onOpenChange, onSave }: PaidlessFormDialogProps) {
  const form = useForm<PaidlessFormValues>({
    resolver: zodResolver(paidlessFormSchema),
    defaultValues: { firstName: paidless?.firstName ?? "", lastName: paidless?.lastName ?? "", title: paidless?.title ?? "" },
  });

  const submit = form.handleSubmit((values) => {
    try {
      onSave(values);
    } catch (error) {
      form.setError("firstName", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ödenmez Ekle"
      description={paidless ? "Ödenmez bilgilerini güncelleyiniz." : "Yeni eklemek istediğiniz ödenmez bilgilerini giriniz."}
      submitLabel={paidless ? "Güncelle" : "Ekle"}
      onSubmit={submit}
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="firstName" label="Ad" required autoFocus />
        <TextField control={form.control} name="lastName" label="Soyad" />
      </div>
      <TextField control={form.control} name="title" label="Unvan" />
    </FormDialog>
  );
}
