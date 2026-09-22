import { z } from "zod";
import { MAX_BULK_TABLES } from "./floor-plan";
import { liraAmountSchema } from "@/lib/money-schema";

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

export const productFormSchema = z.object({
  name: z.string().trim().min(1, "Ürün adı zorunludur").max(60, "Ürün adı en fazla 60 karakter olabilir"),
  categoryId: z.string().min(1, "Kategori seçiniz"),
  // Typed in lira ("75,50"), kept as whole kuruş.
  price: liraAmountSchema({ message: "Geçerli bir fiyat giriniz" }),
  barcode: z.string().trim().max(32, "Barkod en fazla 32 karakter olabilir"),
  isFavorite: z.boolean(),
});
export type ProductFormInput = z.input<typeof productFormSchema>;
export type ProductFormValues = z.output<typeof productFormSchema>;
