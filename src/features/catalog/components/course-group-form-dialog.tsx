"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import { courseGroupFormSchema, type CourseGroup, type CourseGroupFormValues } from "../model/course-group";

interface CourseGroupFormDialogProps {
  open: boolean;
  /** The group being edited, or null when creating. */
  group: CourseGroup | null;
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the group; its message is shown on the name field. */
  onSave: (values: CourseGroupFormValues) => Promise<void>;
}

/** Mount with a new `key` per opening so the form starts from this group's values. */
export function CourseGroupFormDialog({ open, group, onOpenChange, onSave }: CourseGroupFormDialogProps) {
  const form = useForm<CourseGroupFormValues>({
    resolver: zodResolver(courseGroupFormSchema),
    defaultValues: { name: group?.name ?? "" },
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
      title="Marş Grubu Tanımla"
      description={group ? "Marş grubu bilgilerini güncelleyiniz." : "Yeni marş grubu bilgilerini giriniz."}
      submitLabel={group ? "Güncelle" : "Ekle"}
      isSubmitting={form.formState.isSubmitting}
      onSubmit={submit}
    >
      <TextField control={form.control} name="name" label="Grup Adı" required autoFocus />
    </FormDialog>
  );
}
