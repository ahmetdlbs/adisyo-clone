import { describe, expect, it } from "vitest";
import { discountPercentSchema } from "@/features/pos/model/discount-form";

function messages(percent: unknown): string[] {
  const result = discountPercentSchema.safeParse({ percent });
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("discountPercentSchema", () => {
  it.each([
    ["10", 10],
    ["12.5", 12.5],
    ["0", 0],
    ["100", 100],
  ])("reads %j as %s", (input, expected) => {
    expect(discountPercentSchema.parse({ percent: input })).toEqual({ percent: expected });
  });

  it("requires a value", () => {
    expect(messages("  ")).toEqual(["İndirim yüzdesi zorunludur"]);
  });

  it("rejects text", () => {
    expect(messages("abc")).toEqual(["Geçerli bir yüzde giriniz"]);
  });

  it("rejects a negative discount, which would raise the price", () => {
    expect(messages("-10")).toEqual(["İndirim negatif olamaz"]);
  });

  it("rejects more than 100 percent", () => {
    expect(messages("150")).toEqual(["İndirim yüzdesi en fazla 100 olabilir"]);
  });
});
