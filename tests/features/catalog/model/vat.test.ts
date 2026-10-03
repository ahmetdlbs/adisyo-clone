import { describe, expect, it } from "vitest";
import { vatFormSchema } from "@/features/catalog/model/vat";

describe("vatFormSchema", () => {
  it("parses the rate string into a number", () => {
    expect(vatFormSchema.parse({ name: "Yiyecek", rate: "10", isDefault: false })).toEqual({
      name: "Yiyecek",
      rate: 10,
      isDefault: false,
    });
  });

  it("requires a name and a rate", () => {
    const result = vatFormSchema.safeParse({ name: " ", rate: "", isDefault: false });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message).sort()).toEqual(
        ["KDV oranı zorunludur", "Tanım adı zorunludur"].sort()
      );
    }
  });

  it("only accepts the rates Turkish law defines", () => {
    const result = vatFormSchema.safeParse({ name: "Yiyecek", rate: "15", isDefault: false });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0]?.message).toBe("Geçerli bir KDV oranı seçiniz");
  });
});
