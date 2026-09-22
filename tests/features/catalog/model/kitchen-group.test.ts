import { describe, expect, it } from "vitest";
import { createKitchenGroupFormSchema, kitchenStages, type KitchenGroup } from "@/features/catalog/model/kitchen-group";

const GROUPS: readonly KitchenGroup[] = [{ id: "1", name: "Mutfak", hasCookingStage: false, hasPackagingStage: false }];

function messages(input: unknown, editingId: string | null = null): string[] {
  const result = createKitchenGroupFormSchema(GROUPS, editingId).safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("createKitchenGroupFormSchema", () => {
  it("accepts a new group and trims its name", () => {
    const result = createKitchenGroupFormSchema(GROUPS, null).parse({
      name: "  Bar ",
      hasCookingStage: true,
      hasPackagingStage: false,
    });

    expect(result).toEqual({ name: "Bar", hasCookingStage: true, hasPackagingStage: false });
  });

  it("requires a name", () => {
    expect(messages({ name: " ", hasCookingStage: false, hasPackagingStage: false })).toEqual(["Grup adı zorunludur"]);
  });

  it("rejects a name that is already taken, ignoring Turkish case", () => {
    expect(messages({ name: "MUTFAK", hasCookingStage: false, hasPackagingStage: false })).toEqual([
      "Bu mutfak grubu zaten tanımlı",
    ]);
  });

  it("lets the group being edited keep its own name", () => {
    expect(messages({ name: "Mutfak", hasCookingStage: true, hasPackagingStage: false }, "1")).toEqual([]);
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
