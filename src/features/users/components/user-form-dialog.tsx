"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import { userFormSchema, USER_ROLES, type UserFormValues } from "../model/user";

const ROLE_OPTIONS = USER_ROLES.map((role) => ({ value: role, label: role }));

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (values: UserFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts blank each time. */
export function UserFormDialog({ open, onOpenChange, onSave }: UserFormDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: { role: "Garson", name: "", email: "", phone: "", password: "", region: "", callerId: false, blockLogin: false, usePin: false },
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSave(values);
    } catch (error) {
      form.setError("phone", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Kullanıcı Ekle"
      description="Yeni eklemek istediğiniz kullanıcının bilgilerini giriniz"
      submitLabel="Ekle"
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <SelectField control={form.control} name="role" label="Görev Seçiniz" required options={ROLE_OPTIONS} />
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="name" label="Ad Soyad" required autoFocus />
        <TextField control={form.control} name="email" label="E-Mail (İsteğe Bağlı)" type="email" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <TextField control={form.control} name="phone" label="Telefon Numarası" type="tel" inputMode="tel" required />
        <TextField control={form.control} name="password" label="Şifre" type="password" />
      </div>
      <TextField control={form.control} name="region" label="Bölge Seçiniz" />
      <SwitchField control={form.control} name="callerId" label="CallerID kullanıcısı" />
      <SwitchField
        control={form.control}
        name="blockLogin"
        label="Kullanıcı Girişi Engellensin"
        description="Aktif durumda iken kullanıcı Adisyon Merkezi'ne giriş yapamaz."
      />
      <SwitchField
        control={form.control}
        name="usePin"
        label="Pin Kullanılsın"
        description="Birden fazla kullanıcının tek bir ekranı kullandığı durumlarda hızlıca geçiş yapmak için kullanılır."
      />
    </FormDialog>
  );
}
