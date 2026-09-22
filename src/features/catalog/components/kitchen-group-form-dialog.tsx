"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { CheckboxField, TextField } from "@/components/kit/form-fields";
import {
  createKitchenGroupFormSchema,
  type KitchenGroup,
  type KitchenGroupFormValues,
} from "../model/kitchen-group";

interface KitchenGroupFormDialogProps {
  open: boolean;
  /** The group being edited, or null when creating. */
  group: KitchenGroup | null;
  groups: readonly KitchenGroup[];
  onOpenChange: (open: boolean) => void;
  onSave: (values: KitchenGroupFormValues) => void;
}

/** Mount with a new `key` per opening so the form starts from this group's values. */
export function KitchenGroupFormDialog({ open, group, groups, onOpenChange, onSave }: KitchenGroupFormDialogProps) {
  const form = useForm<KitchenGroupFormValues>({
    resolver: zodResolver(createKitchenGroupFormSchema(groups, group?.id ?? null)),
    defaultValues: {
      name: group?.name ?? "",
      hasCookingStage: group?.hasCookingStage ?? false,
      hasPackagingStage: group?.hasPackagingStage ?? false,
    },
  });

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Mutfak Grubu Tanımla"
      description={group ? "Mutfak grubu bilgilerini güncelleyiniz." : "Yeni mutfak grubu bilgilerini giriniz."}
      submitLabel={group ? "Kaydet" : "Ekle"}
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="name" label="Grup Adı" autoFocus />
      <CheckboxField control={form.control} name="hasCookingStage" label="Pişirme aşaması" />
      <CheckboxField control={form.control} name="hasPackagingStage" label="Paketleme aşaması" />
    </FormDialog>
  );
}
