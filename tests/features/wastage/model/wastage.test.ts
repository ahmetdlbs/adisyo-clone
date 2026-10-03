import { describe, expect, it } from "vitest";
import { totalWastageCost, wastageFormSchema, wastageSearchText, type Wastage } from "@/features/wastage/model/wastage";

const KOLA: Wastage = {
  id: "w1",
  productName: "Kola",
  reason: "Kırıldı",
  quantity: 2,
  cost: 4000,
  occurredAt: "2026-09-20T10:00:00.000Z",
  responsible: "Ahmet Can",
};

const values = { productName: "Kola", reason: "Kırıldı", quantity: "2", cost: "40", occurredAt: "2026-09-20T10:00", responsible: "Ahmet Can", stockItemId: "", stockQuantity: "" };

describe("wastageFormSchema", () => {
  it("turns a filled form into a wastage record", () => {
    const result = wastageFormSchema.parse(values);

    expect(result).toMatchObject({ productName: "Kola", reason: "Kırıldı", quantity: 2, cost: 4000, responsible: "Ahmet Can" });
    expect(result.occurredAt).toBe(new Date("2026-09-20T10:00").toISOString());
  });

  it("leaves the stock fields out when no stock card is chosen", () => {
    expect(wastageFormSchema.parse(values)).toMatchObject({ stockItemId: undefined, stockQuantity: undefined });
  });

  it("reads a chosen stock card with its amount (either decimal separator)", () => {
    expect(wastageFormSchema.parse({ ...values, stockItemId: "s1", stockQuantity: "0,5" })).toMatchObject({ stockItemId: "s1", stockQuantity: 0.5 });
  });

  it("wants the stock card and its amount together, and the amount above zero", () => {
    expect(wastageFormSchema.safeParse({ ...values, stockItemId: "s1" }).error?.issues[0]?.message).toBe("Düşülecek stok miktarını giriniz");
    expect(wastageFormSchema.safeParse({ ...values, stockQuantity: "1" }).error?.issues[0]?.message).toBe("Stok kartı seçiniz");
    expect(wastageFormSchema.safeParse({ ...values, stockItemId: "s1", stockQuantity: "0" }).error?.issues[0]?.message).toBe("Stok miktarı sıfırdan büyük olmalıdır");
  });

  it("needs a product", () => {
    expect(wastageFormSchema.safeParse({ ...values, productName: "" }).error?.issues[0]?.message).toBe("Ürün seçiniz");
  });

  it("needs a reason", () => {
    expect(wastageFormSchema.safeParse({ ...values, reason: " " }).error?.issues[0]?.message).toBe("Zayi nedeni zorunludur");
  });

  it("needs a whole positive quantity", () => {
    expect(wastageFormSchema.safeParse({ ...values, quantity: "0" }).error?.issues[0]?.message).toBe("Miktar 1 veya daha fazla olmalıdır");
    expect(wastageFormSchema.safeParse({ ...values, quantity: "1,5" }).success).toBe(false);
  });

  it("needs a valid cost", () => {
    expect(wastageFormSchema.safeParse({ ...values, cost: "abc" }).error?.issues[0]?.message).toBe("Geçerli bir tutar giriniz");
  });

  it("needs someone responsible", () => {
    expect(wastageFormSchema.safeParse({ ...values, responsible: "" }).error?.issues[0]?.message).toBe("Sorumlu kişi zorunludur");
  });
});

describe("totalWastageCost", () => {
  it("adds up the cost", () => {
    expect(totalWastageCost([KOLA, { ...KOLA, id: "w2", cost: 1000 }])).toBe(5000);
    expect(totalWastageCost([])).toBe(0);
  });
});

describe("wastageSearchText", () => {
  it("covers the product, reason and responsible person", () => {
    expect(wastageSearchText(KOLA)).toContain("Kola");
    expect(wastageSearchText(KOLA)).toContain("Kırıldı");
    expect(wastageSearchText(KOLA)).toContain("Ahmet Can");
  });
});
