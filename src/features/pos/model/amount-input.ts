import { parseLira, type Kurus } from "@/lib/money";

export type AmountKey = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "," | "backspace";

const MAX_LENGTH = 9;
const MAX_DECIMALS = 2;

/** Applies one numpad key to the amount being typed (text such as `12,5`), enforcing what a lira amount can look like. */
export function pressKey(current: string, key: AmountKey): string {
  if (key === "backspace") return current.slice(0, -1);
  if (key === ",") {
    if (current.includes(",")) return current;
    return current === "" ? "0," : `${current},`;
  }

  if (current.length >= MAX_LENGTH) return current;
  const [, decimals] = current.split(",");
  if (decimals !== undefined && decimals.length >= MAX_DECIMALS) return current;

  // "0" followed by a digit is that digit, not "05".
  return current === "0" ? (key === "0" ? "0" : key) : `${current}${key}`;
}

/** What the typed text is worth in kuruş, or null while nothing is typed. A dangling comma (`12,`) still counts. */
export function typedAmount(text: string): Kurus | null {
  if (text === "") return null;
  return parseLira(text.endsWith(",") ? text.slice(0, -1) : text);
}
