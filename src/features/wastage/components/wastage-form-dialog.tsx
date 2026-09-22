"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { wastageFormSchema, type WastageFormInput, type WastageFormValues } from "../model/wastage";

const localNow = () => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

interface WastageFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: WastageFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts blank each time. */
export function WastageFormDialog({ open, onOpenChange, onSave }: WastageFormDialogProps) {
  const form = useForm<WastageFormInput, unknown, WastageFormValues>({
    resolver: zodResolver(wastageFormSchema),
    defaultValues: { productName: "", reason: "", quantity: "1", cost: "", occurredAt: localNow(), responsible: "" },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Zayi Ekle"
      description="Bu pencereden zayi ekleyebilirsiniz."
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="productName" label="Ürün" required autoFocus />
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="quantity" label="Miktar" inputMode="numeric" required />
        <TextField control={form.control} name="cost" label="Maliyet tutarı (₺)" inputMode="decimal" required />
      </div>
      <TextField control={form.control} name="occurredAt" label="Zayi Tarihi" type="datetime-local" required />
      <TextField control={form.control} name="reason" label="Zayi nedeni" required />
      <TextField control={form.control} name="responsible" label="Sorumlu Kişi" required />
    </FormDialog>
  );
}
