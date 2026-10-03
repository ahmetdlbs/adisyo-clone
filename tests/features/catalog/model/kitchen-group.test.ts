import { describe, expect, it } from "vitest";
import { kitchenGroupFormSchema, kitchenStages } from "@/features/catalog/model/kitchen-group";

function messages(input: unknown): string[] {
  const result = kitchenGroupFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("kitchenGroupFormSchema", () => {
  it("accepts a new group and trims its name", () => {
    expect(kitchenGroupFormSchema.parse({ name: "  Bar ", hasCookingStage: true, hasPackagingStage: false })).toEqual({
      name: "Bar",
      hasCookingStage: true,
      hasPackagingStage: false,
    });
  });

  it("requires a name", () => {
    expect(messages({ name: " ", hasCookingStage: false, hasPackagingStage: false })).toEqual(["Grup adı zorunludur"]);
  });

  it("limits the name length", () => {
    expect(messages({ name: "a".repeat(31), hasCookingStage: false, hasPackagingStage: false })).toEqual([
      "Grup adı en fazla 30 karakter olabilir",
    ]);
  });
});

describe("kitchenStages", () => {
  const base = { id: "x", name: "Mutfak" };

  it("has only the two default stages when nothing is added", () => {
    expect(kitchenStages({ ...base, hasCookingStage: false, hasPackagingStage: false })).toEqual([
      "Hazırlanıyor",
      "Hazırlandı",
    ]);
  });

  it("inserts the optional stages in kitchen order between the defaults", () => {
    expect(kitchenStages({ ...base, hasCookingStage: true, hasPackagingStage: false })).toEqual([
      "Hazırlanıyor",
      "Pişirme",
      "Hazırlandı",
    ]);
    expect(kitchenStages({ ...base, hasCookingStage: false, hasPackagingStage: true })).toEqual([
      "Hazırlanıyor",
      "Paketleme",
      "Hazırlandı",
    ]);
    expect(kitchenStages({ ...base, hasCookingStage: true, hasPackagingStage: true })).toEqual([
      "Hazırlanıyor",
      "Pişirme",
      "Paketleme",
      "Hazırlandı",
    ]);
  });
});
