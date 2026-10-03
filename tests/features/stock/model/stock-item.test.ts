import { describe, expect, it } from "vitest";
import { adjustStockFormSchema, isLowStock, stockItemFormSchema, stockValue } from "@/features/stock/model/stock-item";

function messages(schema: { safeParse: (value: unknown) => { success: boolean; error?: { issues: { message: string }[] } } }, value: unknown) {
  const result = schema.safeParse(value);
  return result.success ? [] : (result.error?.issues.map((issue) => issue.message) ?? []);
}

describe("stockItemFormSchema", () => {
  const valid = { name: " Dana Kıyma ", unitId: "u1", quantity: "10", unitCost: "", criticalLevel: "" };

  it("trims the name and reads the quantity, leaving critical level unset when blank", () => {
    expect(stockItemFormSchema.parse(valid)).toEqual({
      name: "Dana Kıyma",
      unitId: "u1",
      quantity: 10,
      unitCost: undefined,
      criticalLevel: undefined,
    });
  });

  it("reads the unit cost typed in lira as whole kuruş, and rejects nonsense", () => {
    expect(stockItemFormSchema.parse({ ...valid, unitCost: "45,50" }).unitCost).toBe(4550);
    expect(messages(stockItemFormSchema, { ...valid, unitCost: "abc" })).toEqual(["Geçerli bir tutar giriniz"]);
  });

  it("accepts either decimal separator for quantity and critical level", () => {
    expect(stockItemFormSchema.parse({ ...valid, quantity: "2,5", criticalLevel: "1.5" })).toEqual({
      name: "Dana Kıyma",
      unitId: "u1",
      quantity: 2.5,
      unitCost: undefined,
      criticalLevel: 1.5,
    });
  });

  it("requires a name and a unit", () => {
    expect(messages(stockItemFormSchema, { ...valid, name: " " })).toEqual(["Stok kartı adı zorunludur"]);
    expect(messages(stockItemFormSchema, { ...valid, unitId: "" })).toEqual(["Birim seçiniz"]);
  });

  it.each(["", "abc"])("rejects a quantity of %j", (quantity) => {
    expect(messages(stockItemFormSchema, { ...valid, quantity })).toEqual(["Geçerli bir miktar giriniz"]);
  });

  it("rejects a negative quantity", () => {
    expect(messages(stockItemFormSchema, { ...valid, quantity: "-1" })).toEqual(["Miktar negatif olamaz"]);
  });

  it("rejects a negative critical level", () => {
    expect(messages(stockItemFormSchema, { ...valid, criticalLevel: "-1" })).toEqual(["Kritik seviye negatif olamaz"]);
  });
});

describe("adjustStockFormSchema", () => {
  it("accepts a positive delta", () => {
    expect(adjustStockFormSchema.parse({ delta: "5" })).toEqual({ delta: 5 });
  });

  it("accepts a negative delta", () => {
    expect(adjustStockFormSchema.parse({ delta: "-5" })).toEqual({ delta: -5 });
  });

  it("rejects a zero delta", () => {
    expect(messages(adjustStockFormSchema, { delta: "0" })).toEqual(["Miktar sıfır olamaz"]);
  });

  it("rejects text", () => {
    expect(messages(adjustStockFormSchema, { delta: "abc" })).toEqual(["Geçerli bir miktar giriniz"]);
  });
});

describe("isLowStock", () => {
  it("is false when there is no critical level", () => {
    expect(isLowStock({ quantity: 0, criticalLevel: undefined })).toBe(false);
  });

  it("is true once quantity reaches the critical level", () => {
    expect(isLowStock({ quantity: 2, criticalLevel: 2 })).toBe(true);
    expect(isLowStock({ quantity: 1, criticalLevel: 2 })).toBe(true);
  });

  it("is false above the critical level", () => {
    expect(isLowStock({ quantity: 3, criticalLevel: 2 })).toBe(false);
  });
});

describe("stockValue", () => {
  it("is quantity times unit cost", () => {
    expect(stockValue({ quantity: 2.5, unitCost: 4000 })).toBe(10000);
  });

  it("counts a card with no price, or in shortage, as nothing", () => {
    expect(stockValue({ quantity: 5, unitCost: undefined })).toBe(0);
    expect(stockValue({ quantity: -3, unitCost: 4000 })).toBe(0);
  });
});
