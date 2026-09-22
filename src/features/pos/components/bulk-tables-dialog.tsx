"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import {
  TABLE_SHAPE_OPTIONS,
  bulkTablesFormSchema,
  type BulkTablesFormInput,
  type BulkTablesFormValues,
} from "../model/definition-forms";
import type { Area } from "../model/pos-state";

interface BulkTablesDialogProps {
  open: boolean;
  areas: readonly Area[];
  defaultAreaId: string;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject; its message is shown on the name field. */
  onSave: (values: BulkTablesFormValues) => void;
}

/** Adds several numbered tables at once ("Masa 4", "Masa 5", ...). Mount with a new `key` per opening. */
export function BulkTablesDialog({ open, areas, defaultAreaId, onOpenChange, onSave }: BulkTablesDialogProps) {
  const form = useForm<BulkTablesFormInput, unknown, BulkTablesFormValues>({
    resolver: zodResolver(bulkTablesFormSchema),
    defaultValues: { prefix: "Masa", count: "5", areaId: defaultAreaId, shape: "square" },
  });

  const submit = form.handleSubmit((values) => {
    try {
      onSave(values);
    } catch (error) {
      form.setError("prefix", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Toplu Masa Ekleme"
      description="Adı ve adedi girin; masalar mevcut numaradan sonra numaralanır."
      submitLabel="Kaydet"
      onSubmit={submit}
    >
      <TextField control={form.control} name="prefix" label="Masa Adı" required autoFocus />
      <TextField control={form.control} name="count" label="Miktar" type="number" inputMode="numeric" min={1} step={1} required />
      <SelectField control={form.control} name="areaId" label="Bölge" options={areas.map((area) => ({ value: area.id, label: area.name }))} />
      <SelectField control={form.control} name="shape" label="Şekil" options={TABLE_SHAPE_OPTIONS} />
    </FormDialog>
  );
}
