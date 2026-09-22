import { describe, expect, it } from "vitest";
import {
  areaFormSchema,
  bulkTablesFormSchema,
  categoryFormSchema,
  productFormSchema,
  tableFormSchema,
} from "@/features/pos/model/definition-forms";

function messages(schema: { safeParse: (value: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }, value: unknown) {
  const result = schema.safeParse(value);
  return result.success ? [] : (result.error?.issues.map((issue) => issue.message) ?? []);
}

describe("area and category forms", () => {
  it("trim the name and require it", () => {
    expect(areaFormSchema.parse({ name: " Teras " })).toEqual({ name: "Teras" });
    expect(messages(areaFormSchema, { name: " " })).toEqual(["Bölge adı zorunludur"]);
    expect(categoryFormSchema.parse({ name: " Salatalar " })).toEqual({ name: "Salatalar" });
    expect(messages(categoryFormSchema, { name: "" })).toEqual(["Kategori adı zorunludur"]);
  });
});

describe("tableFormSchema", () => {
  const valid = { name: " Masa 9 ", areaId: "a1", shape: "circle" };

  it("accepts a table", () => {
    expect(tableFormSchema.parse(valid)).toEqual({ name: "Masa 9", areaId: "a1", shape: "circle" });
  });

  it("requires a name and an area, and only knows two shapes", () => {
    expect(messages(tableFormSchema, { ...valid, name: "" })).toEqual(["Masa adı zorunludur"]);
    expect(messages(tableFormSchema, { ...valid, areaId: "" })).toEqual(["Bölge seçiniz"]);
    expect(messages(tableFormSchema, { ...valid, shape: "triangle" })).toHaveLength(1);
  });
});

describe("bulkTablesFormSchema", () => {
  const valid = { prefix: "Masa", count: "5", areaId: "a1", shape: "square" };

  it("reads the count as a whole number", () => {
    expect(bulkTablesFormSchema.parse(valid)).toEqual({ prefix: "Masa", count: 5, areaId: "a1", shape: "square" });
  });

  it.each(["0", "101", "2.5", "abc", ""])("rejects a count of %j", (count) => {
    expect(messages(bulkTablesFormSchema, { ...valid, count })).toEqual(["Adet 1 ile 100 arasında olmalıdır"]);
  });

  it("requires a name prefix", () => {
    expect(messages(bulkTablesFormSchema, { ...valid, prefix: " " })).toEqual(["Masa adı zorunludur"]);
  });
});

describe("productFormSchema", () => {
  const valid = { name: " Limonata ", categoryId: "c1", price: "75,50", barcode: "", isFavorite: false };

  it("turns the typed price into whole kuruş and trims the rest", () => {
    expect(productFormSchema.parse(valid)).toEqual({
      name: "Limonata",
      categoryId: "c1",
      price: 7550,
      barcode: "",
      isFavorite: false,
    });
  });

  it("accepts either decimal separator", () => {
    expect(productFormSchema.parse({ ...valid, price: "75.5" }).price).toBe(7550);
  });

  it.each(["", "0", "abc", "-5", "12,345"])("rejects the price %j", (price) => {
    expect(messages(productFormSchema, { ...valid, price })).toEqual(["Geçerli bir fiyat giriniz"]);
  });

  it("requires a name and a category", () => {
    expect(messages(productFormSchema, { ...valid, name: "" })).toEqual(["Ürün adı zorunludur"]);
    expect(messages(productFormSchema, { ...valid, categoryId: "" })).toEqual(["Kategori seçiniz"]);
  });

  it("limits the barcode length", () => {
    expect(messages(productFormSchema, { ...valid, barcode: "1".repeat(33) })).toEqual(["Barkod en fazla 32 karakter olabilir"]);
  });
});
