"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { createUnitFormSchema, type Unit, type UnitFormValues } from "../model/unit";

interface UnitFormDialogProps {
  open: boolean;
  /** The unit being edited, or null when creating. */
  unit: Unit | null;
  units: readonly Unit[];
  onOpenChange: (open: boolean) => void;
  onSave: (values: UnitFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this unit's values. */
export function UnitFormDialog({ open, unit, units, onOpenChange, onSave }: UnitFormDialogProps) {
  const form = useForm<UnitFormValues>({
    resolver: zodResolver(createUnitFormSchema(units, unit?.id ?? null)),
    defaultValues: { name: unit?.name ?? "" },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Birim Tanımla"
      description={unit ? "Birim bilgilerini güncelleyiniz." : "Yeni birim bilgilerini giriniz."}
      submitLabel={unit ? "Güncelle" : "Ekle"}
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="name" label="Birim Adı" required autoFocus />
    </FormDialog>
  );
}
