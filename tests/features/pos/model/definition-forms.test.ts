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
  const portion = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: "po-1",
    name: "Tam",
    isDefault: true,
    tablePrice: "75,50",
    takeawayPrice: "75,50",
    deliveryPrice: "75,50",
    unitId: "",
    costAmount: "",
    recipeLines: [],
    ...overrides,
  });

  const valid = {
    name: " Limonata ",
    categoryId: "c1",
    color: "",
    barcode: "",
    productCode: "",
    isFavorite: false,
    showOnSalesScreen: true,
    showOnKitchenScreen: true,
    vatExcluded: false,
    autoAskFeaturePortion: false,
    useRecipe: false,
    trackStock: false,
    isCombo: false,
    vatDefinitionId: "",
    kitchenGroupId: "",
    courseGroupId: "",
    portions: [portion()],
    featureGroupIds: [],
    comboItems: [],
  };

  it("turns the typed portion prices into whole kuruş, trims the rest, and blanks the optional links out", () => {
    expect(productFormSchema.parse(valid)).toEqual({
      ...valid,
      name: "Limonata",
      vatDefinitionId: undefined,
      kitchenGroupId: undefined,
      courseGroupId: undefined,
      portions: [
        {
          id: "po-1",
          name: "Tam",
          isDefault: true,
          tablePrice: 7550,
          takeawayPrice: 7550,
          deliveryPrice: 7550,
          unitId: undefined,
          costAmount: undefined,
          recipeLines: [],
        },
      ],
    });
  });

  it("accepts either decimal separator", () => {
    expect(productFormSchema.parse({ ...valid, portions: [portion({ tablePrice: "75.5" })] }).portions[0]?.tablePrice).toBe(7550);
  });

  it.each(["", "0", "abc", "-5", "12,345"])("rejects a portion price of %j", (price) => {
    expect(messages(productFormSchema, { ...valid, portions: [portion({ tablePrice: price })] })).toEqual(["Geçerli bir tutar giriniz"]);
  });

  it("reads a blank cost as untracked, not zero", () => {
    expect(productFormSchema.parse(valid).portions[0]?.costAmount).toBeUndefined();
    expect(productFormSchema.parse({ ...valid, portions: [portion({ costAmount: "12,50" })] }).portions[0]?.costAmount).toBe(1250);
  });

  it("requires a name and a category", () => {
    expect(messages(productFormSchema, { ...valid, name: "" })).toEqual(["Ürün adı zorunludur"]);
    expect(messages(productFormSchema, { ...valid, categoryId: "" })).toEqual(["Kategori seçiniz"]);
  });

  it("limits the barcode length", () => {
    expect(messages(productFormSchema, { ...valid, barcode: "1".repeat(33) })).toEqual(["Barkod en fazla 32 karakter olabilir"]);
  });

  it("requires at least one portion", () => {
    expect(messages(productFormSchema, { ...valid, portions: [] })).toEqual(["En az bir porsiyon ekleyin"]);
  });

  it("rejects two portions with the same name", () => {
    expect(messages(productFormSchema, { ...valid, portions: [portion(), portion({ id: "po-2", name: "tam", isDefault: false })] })).toEqual([
      "Bu porsiyon zaten eklendi",
    ]);
  });

  it("reads a portion's recipe lines and rejects a non-positive quantity", () => {
    const withRecipe = portion({ recipeLines: [{ id: "r1", stockItemId: "s1", quantity: "0,2" }] });
    expect(productFormSchema.parse({ ...valid, useRecipe: true, portions: [withRecipe] }).portions[0]?.recipeLines).toEqual([
      { id: "r1", stockItemId: "s1", quantity: 0.2 },
    ]);

    const zeroQuantity = portion({ recipeLines: [{ id: "r1", stockItemId: "s1", quantity: "0" }] });
    expect(messages(productFormSchema, { ...valid, useRecipe: true, portions: [zeroQuantity] })).toEqual(["Miktar sıfırdan büyük olmalıdır"]);
  });

  it("requires at least one combo item when isCombo is set", () => {
    expect(messages(productFormSchema, { ...valid, isCombo: true, comboItems: [] })).toEqual(["Menüye en az bir ürün ekleyin"]);
  });

  it("reads a combo's items", () => {
    const comboItems = [{ id: "ci1", productId: "p1", portionId: "po1", quantity: "2" }];
    expect(productFormSchema.parse({ ...valid, isCombo: true, comboItems }).comboItems).toEqual([
      { id: "ci1", productId: "p1", portionId: "po1", quantity: 2 },
    ]);
  });

  it("rejects a combo item with a quantity below 1", () => {
    const comboItems = [{ id: "ci1", productId: "p1", portionId: "po1", quantity: "0" }];
    expect(messages(productFormSchema, { ...valid, isCombo: true, comboItems })).toEqual(["Adet en az 1 olmalıdır"]);
  });
});
