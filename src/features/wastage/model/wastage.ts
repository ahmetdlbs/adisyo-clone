import { z } from "zod";
import type { Kurus } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";

export interface Wastage {
  id: string;
  productName: string;
  reason: string;
  quantity: number;
  /** Cost of the loss, in kuruş. */
  cost: Kurus;
  /** ISO timestamp of when it happened. */
  occurredAt: string;
  responsible: string;
}

const MAX_TEXT_LENGTH = 200;

export const wastageFormSchema = z
  .object({
    productName: z.string().trim().min(1, "Ürün seçiniz"),
    reason: z
      .string()
      .trim()
      .min(1, "Zayi nedeni zorunludur")
      .max(
        MAX_TEXT_LENGTH,
        `Zayi nedeni en fazla ${MAX_TEXT_LENGTH} karakter olabilir`,
      ),
    quantity: z
      .string()
      .trim()
      .transform(Number)
      .pipe(
        z
          .number({ invalid_type_error: "Miktar 1 veya daha fazla olmalıdır" })
          .int("Miktar 1 veya daha fazla olmalıdır")
          .min(1, "Miktar 1 veya daha fazla olmalıdır"),
      ),
    cost: liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
    occurredAt: z
      .string()
      .min(1, "Tarih zorunludur")
      .transform((value, context) => {
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
          context.addIssue({
            code: "custom",
            message: "Geçerli bir tarih giriniz",
          });
          return z.NEVER;
        }
        return date.toISOString();
      }),
    responsible: z
      .string()
      .trim()
      .min(1, "Sorumlu kişi zorunludur")
      .max(MAX_TEXT_LENGTH, `En fazla ${MAX_TEXT_LENGTH} karakter olabilir`),
    // Optional: pick a stock card and how much of it was lost, and that amount comes off the stock.
    stockItemId: z.string(),
    stockQuantity: z.string().trim(),
  })
  .superRefine((values, context) => {
    const hasItem = values.stockItemId !== "";
    const hasQuantity = values.stockQuantity !== "";
    if (hasItem && !hasQuantity)
      context.addIssue({
        code: "custom",
        path: ["stockQuantity"],
        message: "Düşülecek stok miktarını giriniz",
      });
    if (!hasItem && hasQuantity)
      context.addIssue({
        code: "custom",
        path: ["stockItemId"],
        message: "Stok kartı seçiniz",
      });
    if (hasQuantity) {
      const quantity = Number(values.stockQuantity.replace(",", "."));
      if (!Number.isFinite(quantity) || quantity <= 0)
        context.addIssue({
          code: "custom",
          path: ["stockQuantity"],
          message: "Stok miktarı sıfırdan büyük olmalıdır",
        });
    }
  })
  .transform((values) => ({
    ...values,
    stockItemId: values.stockItemId || undefined,
    stockQuantity:
      values.stockQuantity === ""
        ? undefined
        : Number(values.stockQuantity.replace(",", ".")),
  }));
export type WastageFormInput = z.input<typeof wastageFormSchema>;
export type WastageFormValues = z.output<typeof wastageFormSchema>;

export const totalWastageCost = (wastages: readonly Wastage[]): Kurus =>
  wastages.reduce((sum, wastage) => sum + wastage.cost, 0);

/** What a search box looks through. */
export const wastageSearchText = (wastage: Wastage): string =>
  `${wastage.productName} ${wastage.reason} ${wastage.responsible}`;
