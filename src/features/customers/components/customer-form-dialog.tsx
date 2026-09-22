"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { toAmountText } from "@/lib/money";
import { customerFormSchema, type Customer, type CustomerFormInput, type CustomerFormValues } from "../model/customer";

interface CustomerFormDialogProps {
  open: boolean;
  /** The customer being edited, or null when adding one. */
  customer: Customer | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to refuse the customer; its message is shown on the phone field. */
  onSave: (values: CustomerFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this customer's values. */
export function CustomerFormDialog({ open, customer, onOpenChange, onSave }: CustomerFormDialogProps) {
  const form = useForm<CustomerFormInput, unknown, CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      firstName: customer?.firstName ?? "",
      lastName: customer?.lastName ?? "",
      phone: customer?.phone ?? "",
      phone2: customer?.phone2 ?? "",
      balance: customer ? toAmountText(customer.balance) : "0",
    },
  });

  const submit = form.handleSubmit((values) => {
    try {
      onSave(values);
    } catch (error) {
      form.setError("phone", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Müşteri Ekle"
      description={customer ? "Müşteri bilgilerini güncelleyiniz." : "Yeni eklemek istediğiniz müşteri bilgilerini giriniz."}
      submitLabel={customer ? "Güncelle" : "Ekle"}
      onSubmit={submit}
    >
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="firstName" label="Ad" required autoFocus />
        <TextField control={form.control} name="lastName" label="Soyad" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="phone" label="Telefon" type="tel" inputMode="tel" />
        <TextField control={form.control} name="phone2" label="Telefon 2" type="tel" inputMode="tel" />
      </div>
      <TextField control={form.control} name="balance" label="Bakiye (₺)" inputMode="decimal" description="Müşterinin işletmeye olan borcu." />
    </FormDialog>
  );
}
