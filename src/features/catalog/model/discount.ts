import { z } from "zod";
import { formatTRY } from "@/lib/format";

export const DISCOUNT_TYPES = ["percent", "amount"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const DISCOUNT_TYPE_OPTIONS = [
  { value: "percent", label: "Yüzde (%)" },
  { value: "amount", label: "Tutar (₺)" },
] as const satisfies readonly { value: DiscountType; label: string }[];

export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  amount: number;
}

const MAX_PERCENT = 100;
const MAX_NAME_LENGTH = 40;

export const discountFormSchema = z
  .object({
    name: z.string().trim().min(1, "İndirim adı zorunludur").max(MAX_NAME_LENGTH, `İndirim adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
    type: z.enum(DISCOUNT_TYPES),
    // The input is a string until submit; parsing here keeps "abc" and "" from ever reaching the model.
    amount: z
      .string()
      .trim()
      .min(1, "Tutar zorunludur")
      .transform(Number)
      .pipe(
        z
          .number({ invalid_type_error: "Geçerli bir tutar giriniz" })
          .positive("Tutar sıfırdan büyük olmalıdır")
      ),
  })
  .refine((values) => values.type !== "percent" || values.amount <= MAX_PERCENT, {
    path: ["amount"],
    message: `Yüzde en fazla ${MAX_PERCENT} olabilir`,
  });

export type DiscountFormInput = z.input<typeof discountFormSchema>;
export type DiscountFormValues = z.output<typeof discountFormSchema>;

const PERCENT_FORMATTER = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });

/** "%12,5" for a percentage, "₺1.250,00" for a fixed amount. */
export function formatDiscountValue({ type, amount }: Pick<Discount, "type" | "amount">): string {
  return type === "percent" ? `%${PERCENT_FORMATTER.format(amount)}` : formatTRY(amount);
}
