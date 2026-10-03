import { z } from "zod";
import type { Kurus } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";

export const SERVICE_CHARGE_KINDS = ["amount", "percent"] as const;
export type ServiceChargeKind = (typeof SERVICE_CHARGE_KINDS)[number];

export const SERVICE_CHARGE_KIND_OPTIONS = [
  { value: "amount", label: "Tutar" },
  { value: "percent", label: "Yüzde" },
] as const satisfies readonly { value: ServiceChargeKind; label: string }[];

/** A cover (kuver) or service (garsoniye) charge: either a fixed amount in kuruş, or a whole percent of the bill. */
export interface ServiceCharge {
  name: string;
  kind: ServiceChargeKind;
  /** Kuruş when `kind` is "amount", a whole 1-100 when `kind` is "percent". */
  amount: number;
  /** Added to a new order automatically, instead of waiting for someone to apply it. */
  autoAdd: boolean;
}

export interface ServiceSettings {
  kuver: ServiceCharge | null;
  garsoniye: ServiceCharge | null;
}

export const createEmptyServiceSettings = (): ServiceSettings => ({ kuver: null, garsoniye: null });

const MAX_NAME_LENGTH = 40;
const MAX_PERCENT = 100;
const PERCENT_MESSAGE = `Yüzde 1 ile ${MAX_PERCENT} arasında bir tam sayı olmalıdır`;

const percentAmountSchema = z.string().transform((text, context) => {
  const percent = Number(text.trim());
  if (!Number.isInteger(percent) || percent < 1 || percent > MAX_PERCENT) {
    context.addIssue({ code: "custom", message: PERCENT_MESSAGE });
    return z.NEVER;
  }
  return percent;
});

/**
 * Form schema for a kuver/garsoniye definition. `kind` picks how `amount` is read (lira or a percent), so the
 * field must be chosen before the form is built; the name field is validated independently either way, so both
 * a missing name and an invalid amount are reported together.
 */
export function createServiceChargeFormSchema(kind: ServiceChargeKind) {
  return z
    .object({
      name: z.string().trim().min(1, "Ad zorunludur").max(MAX_NAME_LENGTH, `Ad en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
      amount: kind === "percent" ? percentAmountSchema : liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
    })
    .transform((values) => ({ ...values, kind }));
}
export type ServiceChargeFormValues = z.infer<ReturnType<typeof createServiceChargeFormSchema>>;

/** kuruş for an "amount" charge, or that percent of `subtotal` (rounded) for a "percent" one. */
export function serviceChargeAmount(charge: ServiceCharge, subtotal: Kurus): Kurus {
  return charge.kind === "amount" ? charge.amount : Math.round((subtotal * charge.amount) / 100);
}
