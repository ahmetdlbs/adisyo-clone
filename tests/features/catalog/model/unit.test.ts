import { describe, expect, it } from "vitest";
import { unitFormSchema } from "@/features/catalog/model/unit";

function messages(input: unknown): string[] {
  const result = unitFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("unitFormSchema", () => {
  it("accepts a new name and trims it", () => {
    expect(unitFormSchema.parse({ name: "  Adet  " })).toEqual({ name: "Adet" });
  });

  it("requires a name", () => {
    expect(messages({ name: "   " })).toEqual(["Birim adı zorunludur"]);
  });

  it("limits the name length", () => {
    expect(messages({ name: "a".repeat(31) })).toEqual(["Birim adı en fazla 30 karakter olabilir"]);
  });
});
