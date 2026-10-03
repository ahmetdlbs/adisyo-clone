"use client";

import { useForm, useWatch } from "react-hook-form";
import { SelectField, SwitchField, TextField } from "@/components/kit/form-fields";
import { Button } from "@/components/ui/button";
import { toAmountText } from "@/lib/money";
import {
  createServiceChargeFormSchema,
  SERVICE_CHARGE_KIND_OPTIONS,
  type ServiceCharge,
  type ServiceChargeKind,
} from "../model/service-charge";

interface ServiceChargeFormFields {
  name: string;
  kind: ServiceChargeKind;
  amount: string;
  autoAdd: boolean;
}

interface ServiceChargeCardProps {
  title: string;
  /** "Kuver" or "Garsoniye": what field labels and the toast are named after. */
  noun: string;
  charge: ServiceCharge | null;
  onSave: (charge: ServiceCharge) => Promise<void>;
}

const toAmountFieldText = (charge: ServiceCharge) => (charge.kind === "amount" ? toAmountText(charge.amount) : String(charge.amount));

/** One editable definition (kuver or garsoniye): name, fixed amount or percent, and whether it is added automatically. */
export function ServiceChargeCard({ title, noun, charge, onSave }: ServiceChargeCardProps) {
  const form = useForm<ServiceChargeFormFields>({
    defaultValues: {
      name: charge?.name ?? "",
      kind: charge?.kind ?? "amount",
      amount: charge ? toAmountFieldText(charge) : "",
      autoAdd: charge?.autoAdd ?? true,
    },
  });
  // The amount field means different things per kind (lira vs. a percent), so the resolver is rebuilt when it changes.
  const kind = useWatch({ control: form.control, name: "kind" });

  // `kind` decides which schema applies, so validation runs by hand instead of through a static resolver.
  const submit = form.handleSubmit(({ autoAdd, ...values }) => {
    form.clearErrors(["name", "amount"]);
    const parsed = createServiceChargeFormSchema(kind).safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) form.setError(issue.path[0] as "name" | "amount", { message: issue.message });
      return;
    }
    onSave({ ...parsed.data, autoAdd });
  });

  return (
    <div role="group" aria-label={title} className="flex h-full flex-col gap-6 rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="text-center text-lg font-medium text-foreground">{title}</h3>

      <div className="rounded border p-1">
        <SwitchField control={form.control} name="autoAdd" label={`${noun} ücreti siparişe otomatik eklensin`} />
      </div>

      <form onSubmit={submit} noValidate className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-6">
          <TextField control={form.control} name="name" label={`${noun} Adı`} required autoFocus />
          <SelectField control={form.control} name="kind" label={`${noun} Tipi`} required options={[...SERVICE_CHARGE_KIND_OPTIONS]} />
          <TextField control={form.control} name="amount" label={`${noun} Tutarı`} inputMode="decimal" required />
        </div>
        <Button type="submit" className="ml-auto">
          Kaydet
        </Button>
      </form>
    </div>
  );
}
