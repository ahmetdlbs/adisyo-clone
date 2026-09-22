import { z } from "zod";
import { isNameTaken } from "@/lib/collection";

export interface KitchenGroup {
  id: string;
  name: string;
  hasCookingStage: boolean;
  hasPackagingStage: boolean;
}

const MAX_NAME_LENGTH = 30;

export function createKitchenGroupFormSchema(groups: readonly KitchenGroup[], editingId: string | null) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, "Grup adı zorunludur")
      .max(MAX_NAME_LENGTH, `Grup adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`)
      .refine((name) => !isNameTaken(groups, name, editingId), "Bu mutfak grubu zaten tanımlı"),
    hasCookingStage: z.boolean(),
    hasPackagingStage: z.boolean(),
  });
}

export type KitchenGroupFormValues = z.infer<ReturnType<typeof createKitchenGroupFormSchema>>;

/** The states an order passes through in this kitchen group: the two defaults plus any optional stage, in order. */
export function kitchenStages({ hasCookingStage, hasPackagingStage }: Pick<KitchenGroup, "hasCookingStage" | "hasPackagingStage">): string[] {
  return [
    "Hazırlanıyor",
    ...(hasCookingStage ? ["Pişirme"] : []),
    ...(hasPackagingStage ? ["Paketleme"] : []),
    "Hazırlandı",
  ];
}
