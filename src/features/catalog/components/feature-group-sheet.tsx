"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FormSheet } from "@/components/kit/form-sheet";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  SELECTION_TYPE_OPTIONS,
  createFeatureGroupFormSchema,
  type FeatureGroup,
  type FeatureGroupFormInput,
  type FeatureGroupFormValues,
} from "../model/feature-group";

interface FeatureGroupSheetProps {
  open: boolean;
  /** The group being edited, or null when creating. */
  group: FeatureGroup | null;
  groups: readonly FeatureGroup[];
  onOpenChange: (open: boolean) => void;
  onSave: (values: FeatureGroupFormValues) => void;
}

const blankOption = () => ({ id: crypto.randomUUID(), name: "", price: "", isDefault: false });

/** Mount with a new `key` per opening so the form starts from this group's values. */
export function FeatureGroupSheet({ open, group, groups, onOpenChange, onSave }: FeatureGroupSheetProps) {
  const form = useForm<FeatureGroupFormInput, unknown, FeatureGroupFormValues>({
    resolver: zodResolver(createFeatureGroupFormSchema(groups, group?.id ?? null)),
    defaultValues: {
      name: group?.name ?? "",
      selectionType: group?.selectionType ?? "single",
      useRecipeProduct: group?.useRecipeProduct ?? false,
      isRequired: group?.isRequired ?? false,
      options: group?.options.length
        ? group.options.map((option) => ({ ...option, price: String(option.price) }))
        : [blankOption()],
    },
  });
  const options = useFieldArray({ control: form.control, name: "options" });
  const { errors } = form.formState;
  const optionsError = errors.options?.message ?? errors.options?.root?.message;

  return (
    <FormSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Özellik Grubu Tanımla"
      description={group ? "Grubu ve özelliklerini güncelleyiniz." : "Yeni özellik grubu ve özelliklerini giriniz."}
      submitLabel={group ? "Kaydet" : "Ekle"}
      onSubmit={form.handleSubmit(onSave)}
    >
      <TextField control={form.control} name="name" label="Özellik grup ismi" required autoFocus />
      <SelectField control={form.control} name="selectionType" label="Seçim tipi" options={SELECTION_TYPE_OPTIONS} />
      <SwitchField control={form.control} name="useRecipeProduct" label="Reçeteli ürün kullan" />
      <SwitchField control={form.control} name="isRequired" label="Özellik seçimi zorunlu olsun" />

      <section aria-label="Özellikler" className="grid gap-2">
        <div className="grid grid-cols-[1fr_7rem_4.5rem_2rem] gap-2 px-1 text-[13px] font-semibold">
          <span>Özellik Adı</span>
          <span>Ekstra Tutar</span>
          <span className="text-center">Varsayılan</span>
          <span />
        </div>

        {options.fields.map((field, index) => {
          const rowErrors = errors.options?.[index];
          return (
            <div key={field.id} className="grid grid-cols-[1fr_7rem_4.5rem_2rem] items-start gap-2">
              <div className="grid gap-1">
                <Input
                  {...form.register(`options.${index}.name`)}
                  aria-label={`Özellik adı ${index + 1}`}
                  placeholder="Özellik adı"
                  aria-invalid={Boolean(rowErrors?.name)}
                />
                {rowErrors?.name && <FieldError errors={[rowErrors.name]} />}
              </div>
              <div className="grid gap-1">
                <Input
                  {...form.register(`options.${index}.price`)}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  placeholder="₺"
                  aria-label={`Ekstra tutar ${index + 1}`}
                  aria-invalid={Boolean(rowErrors?.price)}
                />
                {rowErrors?.price && <FieldError errors={[rowErrors.price]} />}
              </div>
              <div className="flex h-8 items-center justify-center">
                <Controller
                  control={form.control}
                  name={`options.${index}.isDefault`}
                  render={({ field: control }) => (
                    <Checkbox
                      aria-label={`Varsayılan ${index + 1}`}
                      checked={Boolean(control.value)}
                      onCheckedChange={(checked) => control.onChange(checked)}
                    />
                  )}
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Özellik ${index + 1} sil`}
                className="text-destructive hover:text-destructive"
                onClick={() => options.remove(index)}
              >
                <Trash2 />
              </Button>
            </div>
          );
        })}

        {optionsError && <FieldError errors={[{ message: optionsError }]} />}

        <Button type="button" variant="outline" className="justify-self-start" onClick={() => options.append(blankOption())}>
          <Plus />
          Özellik ekle
        </Button>
      </section>
    </FormSheet>
  );
}
