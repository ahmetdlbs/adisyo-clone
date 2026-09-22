"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { TABLE_SHAPE_OPTIONS, tableFormSchema, type TableFormValues } from "../model/definition-forms";
import type { Area, TableDefinition } from "../model/pos-state";

interface TableFormDialogProps {
  open: boolean;
  /** The table being edited, or null when creating. */
  table: TableDefinition | null;
  areas: readonly Area[];
  /** The area to preselect for a new table. */
  defaultAreaId: string;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the table; its message is shown on the name field. */
  onSave: (values: TableFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this table's values. */
export function TableFormDialog({ open, table, areas, defaultAreaId, onOpenChange, onSave }: TableFormDialogProps) {
  const form = useForm<TableFormValues>({
    resolver: zodResolver(tableFormSchema),
    defaultValues: { name: table?.name ?? "", areaId: table?.areaId ?? defaultAreaId, shape: table?.shape ?? "square" },
  });

  const submit = form.handleSubmit((values) => {
    try {
      onSave(values);
    } catch (error) {
      form.setError("name", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Masa Tanımlama"
      description={table ? "Masa bilgilerini güncelleyiniz." : "Yeni masa bilgilerini giriniz."}
      submitLabel={table ? "Güncelle" : "Kaydet"}
      onSubmit={submit}
    >
      <TextField control={form.control} name="name" label="Masa Adı" required autoFocus />
      <SelectField control={form.control} name="areaId" label="Bölge" options={areas.map((area) => ({ value: area.id, label: area.name }))} />
      <SelectField control={form.control} name="shape" label="Şekil" options={TABLE_SHAPE_OPTIONS} />
    </FormDialog>
  );
}
