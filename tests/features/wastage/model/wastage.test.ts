import { describe, expect, it } from "vitest";
import { saveWastage, totalWastageCost, wastageFormSchema, wastageSearchText, type Wastage } from "@/features/wastage/model/wastage";

const KOLA: Wastage = {
  id: "w1",
  productName: "Kola",
  reason: "Kırıldı",
  quantity: 2,
  cost: 4000,
  occurredAt: "2026-09-20T10:00:00.000Z",
  responsible: "Ahmet Can",
};

const values = { productName: "Kola", reason: "Kırıldı", quantity: "2", cost: "40", occurredAt: "2026-09-20T10:00", responsible: "Ahmet Can" };

describe("wastageFormSchema", () => {
  it("turns a filled form into a wastage record", () => {
    const result = wastageFormSchema.parse(values);

    expect(result).toMatchObject({ productName: "Kola", reason: "Kırıldı", quantity: 2, cost: 4000, responsible: "Ahmet Can" });
    expect(result.occurredAt).toBe(new Date("2026-09-20T10:00").toISOString());
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

describe("saveWastage", () => {
  it("adds a wastage record", () => {
    const result = saveWastage([], wastageFormSchema.parse(values), () => "new-id");

    expect(result[0]).toMatchObject({ id: "new-id", productName: "Kola" });
  });

  it("does not modify the list it is given", () => {
    const list: Wastage[] = [];

    saveWastage(list, wastageFormSchema.parse(values), () => "id");

    expect(list).toEqual([]);
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
