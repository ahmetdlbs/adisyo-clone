import { describe, expect, it } from "vitest";
import { liraAmountSchema } from "@/lib/money-schema";

const MESSAGE = "Geçerli bir tutar giriniz";

describe("liraAmountSchema", () => {
  const schema = liraAmountSchema({ message: MESSAGE });

  it("reads an amount typed in lira as whole kuruş", () => {
    expect(schema.parse("75,50")).toBe(7550);
    expect(schema.parse("1.250,75")).toBe(125075);
    expect(schema.parse("  12 ")).toBe(1200);
  });

  it.each(["", "abc", "-5", "12,345", "1,2,3"])("rejects %j with the given message", (text) => {
    const result = schema.safeParse(text);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(MESSAGE);
  });

  it("does not accept zero unless told to", () => {
    expect(schema.safeParse("0").success).toBe(false);
    expect(liraAmountSchema({ message: MESSAGE, allowZero: true }).parse("0")).toBe(0);
  });

  it("can treat an empty field as zero", () => {
    const optional = liraAmountSchema({ message: MESSAGE, allowZero: true, allowEmpty: true });

    expect(optional.parse("")).toBe(0);
    expect(optional.parse("  ")).toBe(0);
    expect(optional.parse("5")).toBe(500);
    expect(optional.safeParse("abc").success).toBe(false);
  });
});
