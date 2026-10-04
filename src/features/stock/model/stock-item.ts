import { z } from "zod";
import { parseLira, type Kurus } from "@/lib/money";

export interface StockItem {
  id: string;
  name: string;
  unitId: string;
  unitName: string;
  quantity: number;
  criticalLevel?: number;
  /** What one unit cost to buy, in kuruş. */
  unitCost?: Kurus;
}

/** What the stock on hand is worth; a card with no price counts for nothing. */
export const stockValue = (
  item: Pick<StockItem, "quantity" | "unitCost">,
): Kurus => Math.round(Math.max(item.quantity, 0) * (item.unitCost ?? 0));

/** Below this fraction of its critical level isn't required — reaching it at all is already low. */
export const isLowStock = (
  item: Pick<StockItem, "quantity" | "criticalLevel">,
): boolean =>
  item.criticalLevel !== undefined && item.quantity <= item.criticalLevel;

const MAX_NAME_LENGTH = 60;

/** Reads a quantity typed with either decimal separator ("2,5" or "2.5"); NaN fails the following `z.number()`. */
const toNumber = (value: string): number =>
  Number(value.trim().replace(",", "."));

export const stockItemFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Stok kartı adı zorunludur")
    .max(
      MAX_NAME_LENGTH,
      `Stok kartı adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`,
    ),
  unitId: z.string().min(1, "Birim seçiniz"),
  quantity: z
    .string()
    .trim()
    .transform((value, context) => {
      if (value === "") {
        context.addIssue({
          code: "custom",
          message: "Geçerli bir miktar giriniz",
        });
        return z.NEVER;
      }
      return toNumber(value);
    })
    .pipe(
      z
        .number({ invalid_type_error: "Geçerli bir miktar giriniz" })
        .min(0, "Miktar negatif olamaz"),
    ),
  // Typed in lira ("45,50") and kept as whole kuruş; blank means no price entered.
  unitCost: z.string().transform((text, context) => {
    if (text.trim() === "") return undefined;
    const kurus = parseLira(text);
    if (kurus === null) {
      context.addIssue({
        code: "custom",
        message: "Geçerli bir tutar giriniz",
      });
      return z.NEVER;
    }
    return kurus;
  }),
  criticalLevel: z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : toNumber(value)))
    .pipe(
      z
        .number({ invalid_type_error: "Geçerli bir kritik seviye giriniz" })
        .min(0, "Kritik seviye negatif olamaz")
        .optional(),
    ),
});
export type StockItemFormInput = z.input<typeof stockItemFormSchema>;
export type StockItemFormValues = z.output<typeof stockItemFormSchema>;

/** A stock entry's amount: positive adds stock, negative removes it — unlike quantity/criticalLevel, not floored at zero. */
export const adjustStockFormSchema = z.object({
  delta: z
    .string()
    .trim()
    .transform(toNumber)
    .pipe(
      z
        .number({ invalid_type_error: "Geçerli bir miktar giriniz" })
        .refine((value) => value !== 0, "Miktar sıfır olamaz"),
    ),
});
export type AdjustStockFormInput = z.input<typeof adjustStockFormSchema>;
export type AdjustStockFormValues = z.output<typeof adjustStockFormSchema>;

export interface StockCountLine {
  stockItemId: string;
  quantity: number;
}

export type StockCountResult = { ok: true; lines: StockCountLine[] } | { ok: false; message: string };

/**
 * Turns what was typed in the count sheet into the lines to send: blank cells and quantities equal to the
 * system's are skipped, and one bad or negative number rejects the whole sheet so nothing is half-counted.
 */
export function buildStockCount(items: readonly StockItem[], entries: Readonly<Record<string, string>>): StockCountResult {
  const lines: StockCountLine[] = [];
  for (const item of items) {
    const typed = (entries[item.id] ?? "").trim();
    if (typed === "") continue;
    const quantity = toNumber(typed);
    if (!Number.isFinite(quantity) || quantity < 0) {
      return { ok: false, message: `"${item.name}" için geçerli bir miktar giriniz` };
    }
    if (quantity !== item.quantity) lines.push({ stockItemId: item.id, quantity });
  }
  return lines.length === 0 ? { ok: false, message: "Sayım sonucunda değişen bir miktar yok" } : { ok: true, lines };
}
