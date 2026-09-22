import { describe, expect, it } from "vitest";
import { discountFormSchema, formatDiscountValue } from "@/features/catalog/model/discount";

function parse(input: unknown) {
  return discountFormSchema.safeParse(input);
}

function messages(input: unknown): string[] {
  const result = parse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("discountFormSchema", () => {
  it("parses the amount string into a number and trims the name", () => {
    const result = discountFormSchema.parse({ name: " Öğrenci ", type: "percent", amount: "10" });

    expect(result).toEqual({ name: "Öğrenci", type: "percent", amount: 10 });
  });

  it("requires a name", () => {
    expect(messages({ name: "", type: "percent", amount: "10" })).toEqual(["İndirim adı zorunludur"]);
  });

  it("requires an amount", () => {
    expect(messages({ name: "Öğrenci", type: "percent", amount: "" })).toEqual(["Tutar zorunludur"]);
  });

  it("rejects an amount that is not a number", () => {
    expect(messages({ name: "Öğrenci", type: "amount", amount: "abc" })).toEqual(["Geçerli bir tutar giriniz"]);
  });

  it.each(["0", "-5"])("rejects a non-positive amount (%s)", (amount) => {
    expect(messages({ name: "Öğrenci", type: "amount", amount })).toEqual(["Tutar sıfırdan büyük olmalıdır"]);
  });

  it("caps a percentage at 100", () => {
    expect(messages({ name: "Öğrenci", type: "percent", amount: "100.5" })).toEqual(["Yüzde en fazla 100 olabilir"]);
    expect(parse({ name: "Öğrenci", type: "percent", amount: "100" }).success).toBe(true);
  });

  it("allows a fixed amount above 100", () => {
    expect(parse({ name: "Kupon", type: "amount", amount: "250" }).success).toBe(true);
  });

  it("only accepts known discount types", () => {
    expect(parse({ name: "Öğrenci", type: "coupon", amount: "10" }).success).toBe(false);
  });
});

describe("formatDiscountValue", () => {
  it("shows percentages with the percent sign in front", () => {
    expect(formatDiscountValue({ type: "percent", amount: 10 })).toBe("%10");
    expect(formatDiscountValue({ type: "percent", amount: 12.5 })).toBe("%12,5");
  });

  it("shows fixed amounts as lira", () => {
    expect(formatDiscountValue({ type: "amount", amount: 1250 })).toBe("₺1.250,00");
  });
});
