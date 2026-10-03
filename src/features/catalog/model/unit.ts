import { z } from "zod";

export interface Unit {
  id: string;
  name: string;
}

const MAX_NAME_LENGTH = 30;

export const unitFormSchema = z.object({
  name: z.string().trim().min(1, "Birim adı zorunludur").max(MAX_NAME_LENGTH, `Birim adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
});

export type UnitFormValues = z.infer<typeof unitFormSchema>;
