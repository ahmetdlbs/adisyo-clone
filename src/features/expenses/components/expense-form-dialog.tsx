"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, TextField } from "@/components/kit/form-fields";
import { EXPENSE_PAYMENT_METHODS, EXPENSE_TYPES, expenseFormSchema, type ExpenseFormInput, type ExpenseFormValues } from "../model/expense";

const TYPE_OPTIONS = EXPENSE_TYPES.map((type) => ({ value: type, label: type }));
const localNow = () => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
};

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: ExpenseFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts blank each time. */
export function ExpenseFormDialog({ open, onOpenChange, onSave }: ExpenseFormDialogProps) {
  const form = useForm<ExpenseFormInput, unknown, ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: { type: EXPENSE_TYPES[0], paymentMethod: "cash", amount: "", occurredAt: localNow(), note: "" },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Ekle"
      description="Eklemek istediğiniz masraf bilgilerini giriniz"
      onSubmit={form.handleSubmit(onSave)}
    >
      <div className="grid grid-cols-2 gap-4">
        <SelectField control={form.control} name="type" label="Masraf tipi" required options={TYPE_OPTIONS} />
        <SelectField control={form.control} name="paymentMethod" label="Ödeme Tipi" required options={[...EXPENSE_PAYMENT_METHODS]} />
      </div>
      <TextField control={form.control} name="occurredAt" label="Masraf tarihi" type="datetime-local" required />
      <TextField control={form.control} name="amount" label="Tutar (₺)" inputMode="decimal" required />
      <TextField control={form.control} name="note" label="Açıklama" />
    </FormDialog>
  );
}
