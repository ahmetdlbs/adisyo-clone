import { z } from "zod";

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
