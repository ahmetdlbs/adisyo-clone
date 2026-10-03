"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { CheckboxField, TextField } from "@/components/kit/form-fields";
import { kitchenGroupFormSchema, type KitchenGroup, type KitchenGroupFormValues } from "../model/kitchen-group";

interface KitchenGroupFormDialogProps {
  open: boolean;
  /** The group being edited, or null when creating. */
  group: KitchenGroup | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the group; its message is shown on the name field. */
  onSave: (values: KitchenGroupFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this group's values. */
export function KitchenGroupFormDialog({ open, group, onOpenChange, onSave }: KitchenGroupFormDialogProps) {
  const form = useForm<KitchenGroupFormValues>({
    resolver: zodResolver(kitchenGroupFormSchema),
    defaultValues: {
      name: group?.name ?? "",
      hasCookingStage: group?.hasCookingStage ?? false,
      hasPackagingStage: group?.hasPackagingStage ?? false,
    },
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
      title="Mutfak Grubu Tanımla"
      description={group ? "Mutfak grubu bilgilerini güncelleyiniz." : "Yeni mutfak grubu bilgilerini giriniz."}
      submitLabel={group ? "Kaydet" : "Ekle"}
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField control={form.control} name="name" label="Grup Adı" autoFocus />
      <CheckboxField control={form.control} name="hasCookingStage" label="Pişirme aşaması" />
      <CheckboxField control={form.control} name="hasPackagingStage" label="Paketleme aşaması" />
    </FormDialog>
  );
}
