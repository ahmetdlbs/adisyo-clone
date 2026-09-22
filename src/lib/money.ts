import { formatTRY } from "@/lib/format";

/** An amount of money in whole kuruş (1 lira = 100). Integers only, so sums and splits never drift. */
export type Kurus = number;

export const toKurus = (lira: number): Kurus => Math.round(lira * 100);

export const formatKurus = (amount: Kurus): string => formatTRY(amount / 100);

/**
 * Reads what a person types into an amount field. Accepts `12`, `12,5`, `12.50` and `1.250,75`; a comma means
 * "decimal comma" and dots are then thousands separators. Returns null for anything else (negative numbers,
 * more than two decimals, text), so bad input never becomes an amount.
 */
export function parseLira(input: string): Kurus | null {
  const text = input.trim().replace(/\s/g, "");
  const normalized = text.includes(",") ? text.replace(/\./g, "").replace(",", ".") : text;
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  return Math.round(Number(normalized) * 100);
}

/** An amount as it would be typed: `3334` kuruş -> `33,34`, `10000` -> `100`. Trailing zeros are dropped. */
export function toAmountText(amount: Kurus): string {
  const lira = Math.floor(amount / 100);
  const kurus = amount % 100;
  if (kurus === 0) return String(lira);
  return `${lira},${String(kurus).padStart(2, "0").replace(/0$/, "")}`;
}

/** Splits a total into `parts` shares that add back up to exactly the total; leftover kuruş go to the first shares. */
export function splitEvenly(total: Kurus, parts: number): Kurus[] {
  if (!Number.isInteger(parts) || parts < 1) {
    throw new RangeError(`splitEvenly: parts must be a whole number of at least 1, received ${parts}`);
  }
  const base = Math.floor(total / parts);
  const leftover = total - base * parts;
  return Array.from({ length: parts }, (_, index) => (index < leftover ? base + 1 : base));
}

/** `percent`% of an amount, rounded half up to a whole kuruş. */
export function percentOf(amount: Kurus, percent: number): Kurus {
  return Math.round((amount * percent) / 100);
}
