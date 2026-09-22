import { z } from "zod";
import { parseLira } from "./money";

interface LiraAmountOptions {
  /** Shown on the field when the text is not a valid amount. */
  message: string;
  /** Accept "0". Off by default: most amounts (a price, an expense) must be positive. */
  allowZero?: boolean;
  /** Read an empty field as 0 instead of an error, for amounts that are optional. */
  allowEmpty?: boolean;
}

/**
 * Schema for an amount a person types in lira ("75,50"). Its input is the field's text and its output is whole
 * kuruş, so use it with `useForm<z.input, unknown, z.output>`.
 */
export function liraAmountSchema({ message, allowZero = false, allowEmpty = false }: LiraAmountOptions) {
  return z.string().transform((text, context) => {
    if (allowEmpty && text.trim() === "") return 0;
    const kurus = parseLira(text);
    if (kurus === null || (kurus === 0 && !allowZero)) {
      context.addIssue({ code: "custom", message });
      return z.NEVER;
    }
    return kurus;
  });
}
