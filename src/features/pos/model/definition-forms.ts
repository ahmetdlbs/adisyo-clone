import { z } from "zod";
import { parseLira } from "@/lib/money";
import { liraAmountSchema } from "@/lib/money-schema";

/** Matches api/'s AddTablesDto — see api/src/floor-plan/dto/add-tables.dto.ts. */
export const MAX_BULK_TABLES = 100;

/*
 * Form schemas for the menu and floor-plan definitions. They check what a form can check on its own (required,
 * format, range); rules that need the whole state (duplicates, open bills) live in the model functions, whose
 * error message the form shows on the field.
 */

export const areaFormSchema = z.object({ name: z.string().trim().min(1, "Bölge adı zorunludur").max(30, "Bölge adı en fazla 30 karakter olabilir") });
export type AreaFormValues = z.infer<typeof areaFormSchema>;

export const categoryFormSchema = z.object({ name: z.string().trim().min(1, "Kategori adı zorunludur").max(40, "Kategori adı en fazla 40 karakter olabilir") });
export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

const SHAPES = ["square", "circle"] as const;
export const TABLE_SHAPE_OPTIONS = [
  { value: "square", label: "Kare" },
  { value: "circle", label: "Daire" },
] as const satisfies readonly { value: (typeof SHAPES)[number]; label: string }[];

const tableName = z.string().trim().min(1, "Masa adı zorunludur").max(30, "Masa adı en fazla 30 karakter olabilir");

export const tableFormSchema = z.object({
  name: tableName,
  areaId: z.string().min(1, "Bölge seçiniz"),
  shape: z.enum(SHAPES),
});
export type TableFormValues = z.infer<typeof tableFormSchema>;

const COUNT_MESSAGE = `Adet 1 ile ${MAX_BULK_TABLES} arasında olmalıdır`;

export const bulkTablesFormSchema = z.object({
  prefix: tableName,
  count: z
    .string()
    .trim()
    .transform(Number)
    .pipe(z.number({ invalid_type_error: COUNT_MESSAGE }).int(COUNT_MESSAGE).min(1, COUNT_MESSAGE).max(MAX_BULK_TABLES, COUNT_MESSAGE)),
  areaId: z.string().min(1, "Bölge seçiniz"),
  shape: z.enum(SHAPES),
});
export type BulkTablesFormInput = z.input<typeof bulkTablesFormSchema>;
export type BulkTablesFormValues = z.output<typeof bulkTablesFormSchema>;

/** An optional amount field ("Maliyet Tutarı"): blank means "not tracked", not zero. */
const optionalLiraAmount = z.string().transform((text, context) => {
  if (text.trim() === "") return undefined;
  const kurus = parseLira(text);
  if (kurus === null) {
    context.addIssue({ code: "custom", message: "Geçerli bir tutar giriniz" });
    return z.NEVER;
  }
  return kurus;
});

/** A recipe line's amount ("0,2"): a plain decimal quantity, not money, and must be greater than zero. */
const recipeLineFormSchema = z.object({
  // A client-only key for the field array (react-hook-form).
  id: z.string(),
  stockItemId: z.string().min(1, "Stok kartı seçiniz"),
  quantity: z
    .string()
    .trim()
    .transform((text) => Number(text.replace(",", ".")))
    .pipe(z.number({ invalid_type_error: "Geçerli bir miktar giriniz" }).positive("Miktar sıfırdan büyük olmalıdır")),
});

const MAX_PORTION_NAME = 30;

const portionFormSchema = z.object({
  // A client-only key for the field array (react-hook-form); the API assigns each portion's own row.
  id: z.string(),
  name: z.string().trim().min(1, "Porsiyon adı zorunludur").max(MAX_PORTION_NAME, `Porsiyon adı en fazla ${MAX_PORTION_NAME} karakter olabilir`),
  isDefault: z.boolean(),
  tablePrice: liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
  takeawayPrice: liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
  deliveryPrice: liraAmountSchema({ message: "Geçerli bir tutar giriniz" }),
  // "" means no unit chosen.
  unitId: z.string().transform((value) => value || undefined),
  costAmount: optionalLiraAmount,
  recipeLines: z.array(recipeLineFormSchema),
});

const comboItemFormSchema = z.object({
  // A client-only key for the field array (react-hook-form).
  id: z.string(),
  productId: z.string().min(1, "Ürün seçiniz"),
  portionId: z.string().min(1, "Porsiyon seçiniz"),
  quantity: z
    .string()
    .trim()
    .transform(Number)
    .pipe(z.number({ invalid_type_error: "Geçerli bir adet giriniz" }).int("Adet tam sayı olmalıdır").min(1, "Adet en az 1 olmalıdır")),
});

export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, "Ürün adı zorunludur").max(60, "Ürün adı en fazla 60 karakter olabilir"),
    categoryId: z.string().min(1, "Kategori seçiniz"),
    color: z.string().trim(),
    barcode: z.string().trim().max(32, "Barkod en fazla 32 karakter olabilir"),
    productCode: z.string().trim().max(32, "Ürün kodu en fazla 32 karakter olabilir"),
    isFavorite: z.boolean(),
    showOnSalesScreen: z.boolean(),
    showOnKitchenScreen: z.boolean(),
    vatExcluded: z.boolean(),
    autoAskFeaturePortion: z.boolean(),
    useRecipe: z.boolean(),
    trackStock: z.boolean(),
    isCombo: z.boolean(),
    // "" means none chosen, for all three of these.
    vatDefinitionId: z.string(),
    kitchenGroupId: z.string(),
    courseGroupId: z.string(),
    portions: z.array(portionFormSchema).min(1, "En az bir porsiyon ekleyin"),
    featureGroupIds: z.array(z.string()),
    comboItems: z.array(comboItemFormSchema),
  })
  .superRefine((values, context) => {
    const seen = new Set<string>();
    values.portions.forEach((portion, index) => {
      const key = portion.name.toLocaleLowerCase("tr");
      if (seen.has(key)) {
        context.addIssue({ code: "custom", path: ["portions", index, "name"], message: "Bu porsiyon zaten eklendi" });
      }
      seen.add(key);
    });
    if (values.isCombo && values.comboItems.length === 0) {
      context.addIssue({ code: "custom", path: ["comboItems"], message: "Menüye en az bir ürün ekleyin" });
    }
  })
  .transform((values) => ({
    ...values,
    vatDefinitionId: values.vatDefinitionId || undefined,
    kitchenGroupId: values.kitchenGroupId || undefined,
    courseGroupId: values.courseGroupId || undefined,
  }));
export type ProductFormSchema = typeof productFormSchema;
export type ProductFormInput = z.input<ProductFormSchema>;
export type ProductFormValues = z.output<ProductFormSchema>;
