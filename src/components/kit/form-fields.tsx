"use client";

import { useId, type ComponentProps, type ReactNode } from "react";
import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

/*
 * react-hook-form + shadcn Field bindings. Each field owns its label, description, error and the
 * aria-invalid / data-invalid wiring, so a form only lists `control`, `name` and `label`.
 */

/** `TOut` is the schema's output type; it differs from `T` when the schema transforms (e.g. "10" -> 10). */
interface FieldBaseProps<T extends FieldValues, TOut = T> {
  control: Control<T, unknown, TOut>;
  name: FieldPath<T>;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}

function RequiredMark() {
  return (
    <span aria-hidden="true" className="text-destructive">
      *
    </span>
  );
}

type TextFieldProps<T extends FieldValues, TOut> = FieldBaseProps<T, TOut> & {
  required?: boolean;
} & Pick<ComponentProps<typeof Input>, "type" | "placeholder" | "autoComplete" | "inputMode" | "autoFocus" | "maxLength" | "min" | "max" | "step">;

export function TextField<T extends FieldValues, TOut = T>({
  control,
  name,
  label,
  description,
  required,
  disabled,
  type,
  ...inputProps
}: TextFieldProps<T, TOut>) {
  const id = `${useId()}-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            {label}
            {required && <RequiredMark />}
          </FieldLabel>
          {type === "password" ? (
            <PasswordInput
              {...field}
              {...inputProps}
              id={id}
              value={field.value ?? ""}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
          ) : (
            <Input
              {...field}
              {...inputProps}
              type={type}
              id={id}
              value={field.value ?? ""}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
            />
          )}
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps<T extends FieldValues, TOut> = FieldBaseProps<T, TOut> & {
  options: readonly SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export function SelectField<T extends FieldValues, TOut = T>({
  control,
  name,
  label,
  description,
  options,
  placeholder = "Seçiniz",
  required,
  disabled,
}: SelectFieldProps<T, TOut>) {
  const id = `${useId()}-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>
            {label}
            {required && <RequiredMark />}
          </FieldLabel>
          {/* `items` lets the trigger show the selected option's label instead of its raw value. */}
          <Select
            items={[...options]}
            name={field.name}
            value={field.value || null}
            onValueChange={(value) => field.onChange(value)}
            disabled={disabled}
          >
            <SelectTrigger id={id} className="w-full" aria-invalid={fieldState.invalid} onBlur={field.onBlur}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export function SwitchField<T extends FieldValues, TOut = T>({
  control,
  name,
  label,
  description,
  disabled,
}: FieldBaseProps<T, TOut>) {
  const id = `${useId()}-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid} className="items-center justify-between gap-4 border-b py-3 first:pt-0 last:border-b-0 last:pb-0">
          <FieldContent>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
          <Switch
            id={id}
            aria-label={label}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            onBlur={field.onBlur}
            disabled={disabled}
          />
        </Field>
      )}
    />
  );
}

export function CheckboxField<T extends FieldValues, TOut = T>({
  control,
  name,
  label,
  description,
  disabled,
}: FieldBaseProps<T, TOut>) {
  const id = `${useId()}-${name}`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <Checkbox
            id={id}
            aria-label={label}
            checked={Boolean(field.value)}
            onCheckedChange={(checked) => field.onChange(checked)}
            onBlur={field.onBlur}
            disabled={disabled}
          />
          <FieldContent>
            <FieldLabel htmlFor={id} className="font-normal">
              {label}
            </FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </FieldContent>
        </Field>
      )}
    />
  );
}
