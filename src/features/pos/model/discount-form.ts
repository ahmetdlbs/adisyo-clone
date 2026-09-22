import { z } from "zod";

/** Form schema for the order-wide discount percentage. The typed text becomes a number between 0 and 100. */
export const discountPercentSchema = z.object({
  percent: z
    .string()
    .trim()
    .min(1, "İndirim yüzdesi zorunludur")
    .transform(Number)
    .pipe(
      z
        .number({ invalid_type_error: "Geçerli bir yüzde giriniz" })
        .min(0, "İndirim negatif olamaz")
        .max(100, "İndirim yüzdesi en fazla 100 olabilir")
    ),
});

export type DiscountPercentInput = z.input<typeof discountPercentSchema>;
export type DiscountPercentValues = z.output<typeof discountPercentSchema>;
