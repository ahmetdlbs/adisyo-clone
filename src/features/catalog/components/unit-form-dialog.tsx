"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { unitFormSchema, type Unit, type UnitFormValues } from "../model/unit";

interface UnitFormDialogProps {
  open: boolean;
  /** The unit being edited, or null when creating. */
  unit: Unit | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the unit; its message is shown on the name field. */
  onSave: (values: UnitFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this unit's values. */
export function UnitFormDialog({ open, unit, onOpenChange, onSave }: UnitFormDialogProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(unitFormSchema),
    defaultValues: { name: unit?.name ?? "" },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      form.setError("name", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Birim Tanımla"
      description={unit ? "Birim bilgilerini güncelleyiniz." : "Yeni birim bilgilerini giriniz."}
      submitLabel={unit ? "Güncelle" : "Ekle"}
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField control={form.control} name="name" label="Birim Adı" required autoFocus />
    </FormDialog>
  );
}
