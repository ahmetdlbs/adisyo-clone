import { z } from "zod";
import { isNameTaken } from "@/lib/collection";

export const SELECTION_TYPES = ["single", "multiple"] as const;
export type SelectionType = (typeof SELECTION_TYPES)[number];

export const SELECTION_TYPE_OPTIONS = [
  { value: "single", label: "Tekli Seçim" },
  { value: "multiple", label: "Çoklu Seçim" },
] as const satisfies readonly { value: SelectionType; label: string }[];

export interface FeatureOption {
  id: string;
  name: string;
  /** Extra charge in lira. */
  price: number;
  isDefault: boolean;
}

export interface FeatureGroup {
  id: string;
  name: string;
  selectionType: SelectionType;
  useRecipeProduct: boolean;
  isRequired: boolean;
  options: readonly FeatureOption[];
}

const MAX_NAME_LENGTH = 40;

const featureOptionSchema = z.object({
  id: z.string(),
  // A blank name is a spare row the user never filled; it is dropped on save, not reported.
  name: z.string().trim().max(MAX_NAME_LENGTH, `Özellik adı en fazla ${MAX_NAME_LENGTH} karakter olabilir`),
  price: z
    .string()
    .trim()
    .transform((value) => (value === "" ? 0 : Number(value)))
    .pipe(z.number({ invalid_type_error: "Geçerli bir tutar giriniz" }).min(0, "Tutar negatif olamaz")),
  isDefault: z.boolean(),
});

export function createFeatureGroupFormSchema(groups: readonly FeatureGroup[], editingId: string | null) {
  return z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Özellik grup ismi zorunludur")
        .max(MAX_NAME_LENGTH, `Özellik grup ismi en fazla ${MAX_NAME_LENGTH} karakter olabilir`)
        .refine((name) => !isNameTaken(groups, name, editingId), "Bu özellik grubu zaten tanımlı"),
      selectionType: z.enum(SELECTION_TYPES),
      useRecipeProduct: z.boolean(),
      isRequired: z.boolean(),
      options: z.array(featureOptionSchema),
    })
    .superRefine((values, context) => {
      const named = values.options.map((option, index) => ({ option, index })).filter(({ option }) => option.name !== "");

      if (named.length === 0) {
        context.addIssue({ code: "custom", path: ["options"], message: "En az bir özellik ekleyin" });
        return;
      }

      const seen = new Set<string>();
      for (const { option, index } of named) {
        const key = option.name.toLocaleLowerCase("tr");
        if (seen.has(key)) {
          context.addIssue({ code: "custom", path: ["options", index, "name"], message: "Bu özellik zaten eklendi" });
        }
        seen.add(key);
      }

      const defaultCount = named.filter(({ option }) => option.isDefault).length;
      if (values.selectionType === "single" && defaultCount > 1) {
        context.addIssue({
          code: "custom",
          path: ["options"],
          message: "Tekli seçimde yalnızca bir varsayılan özellik olabilir",
        });
      }
    })
    .transform((values) => ({ ...values, options: values.options.filter((option) => option.name !== "") }));
}

export type FeatureGroupFormSchema = ReturnType<typeof createFeatureGroupFormSchema>;
export type FeatureGroupFormInput = z.input<FeatureGroupFormSchema>;
export type FeatureGroupFormValues = z.output<FeatureGroupFormSchema>;
