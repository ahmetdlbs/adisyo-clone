import { z } from "zod";
import { removeById, upsertById } from "@/lib/collection";

/** VAT rates that can be assigned to a product group. */
export const VAT_RATES = [0, 1, 8, 10, 18, 20] as const;
export const MAX_VAT_DEFINITIONS = 8;

export interface VatDefinition {
  id: string;
  name: string;
  rate: number;
  isDefault: boolean;
}

export const VAT_RATE_OPTIONS = VAT_RATES.map((rate) => ({ value: String(rate), label: `%${rate}` }));

const MAX_NAME_LENGTH = 30;

export const vatFormSchema = z.object({
  name: z.string().trim().min(1, "Tanım adı zorunludur").max(MAX_NAME_LENGTH, `Tanım adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  rate: z
    .string()
    .min(1, "KDV oranı zorunludur")
    .transform(Number)
    .pipe(z.number().refine((rate) => (VAT_RATES as readonly number[]).includes(rate), "Geçerli bir KDV oranı seçiniz")),
  isDefault: z.boolean(),
});

export type VatFormInput = z.input<typeof vatFormSchema>;
export type VatFormValues = z.output<typeof vatFormSchema>;

/** Guarantees exactly one default in a non-empty list: keeps the first flagged one, else promotes the first item. */
function withSingleDefault(items: readonly VatDefinition[]): readonly VatDefinition[] {
  const defaultId = items.find((item) => item.isDefault)?.id ?? items[0]?.id;
  return items.map((item) => (item.isDefault === (item.id === defaultId) ? item : { ...item, isDefault: item.id === defaultId }));
}

/**
 * Creates (editingId null) or updates a definition. A definition that asks to be the default takes the flag from
 * the others. Throws when creating would exceed {@link MAX_VAT_DEFINITIONS}; the UI disables that action first.
 */
export function saveVat(
  items: readonly VatDefinition[],
  values: VatFormValues,
  editingId: string | null,
  createId: () => string
): readonly VatDefinition[] {
  if (editingId === null && items.length >= MAX_VAT_DEFINITIONS) {
    throw new RangeError(`En fazla ${MAX_VAT_DEFINITIONS} KDV tanımı oluşturulabilir`);
  }

  const saved: VatDefinition = { id: editingId ?? createId(), ...values };
  const others = saved.isDefault ? items.map((item) => ({ ...item, isDefault: false })) : items;
  return withSingleDefault(upsertById(others, saved));
}

/** Removes a definition; if it was the default, the first remaining one becomes the default. */
export function removeVat(items: readonly VatDefinition[], id: string): readonly VatDefinition[] {
  return withSingleDefault(removeById(items, id));
}
