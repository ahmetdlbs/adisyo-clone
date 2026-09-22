import { z } from "zod";
import { isNameTaken } from "@/lib/collection";

export interface Unit {
  id: string;
  name: string;
}

const MAX_NAME_LENGTH = 30;

/**
 * Form schema for a portion/unit. `units` is the current list and `editingId` the unit being edited (null when
 * creating), so a unit may keep its own name but cannot take another unit's.
 */
export function createUnitFormSchema(units: readonly Unit[], editingId: string | null) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Birim adı zorunludur")
      .max(MAX_NAME_LENGTH, `Birim adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`)
      .refine((name) => !isNameTaken(units, name, editingId), "Bu birim zaten tanımlı"),
  });
}

export type UnitFormValues = z.infer<ReturnType<typeof createUnitFormSchema>>;
