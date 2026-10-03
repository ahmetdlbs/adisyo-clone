import { describe, expect, it } from "vitest";
import { featureGroupFormSchema } from "@/features/catalog/model/feature-group";

const option = (overrides: Record<string, unknown> = {}) => ({ id: "o1", name: "Az pişmiş", price: "0", isDefault: false, ...overrides });
const group = (overrides: Record<string, unknown> = {}) => ({
  name: "Ekstralar",
  selectionType: "multiple",
  useRecipeProduct: false,
  isRequired: false,
  options: [option()],
  ...overrides,
});

function issues(input: unknown) {
  const result = featureGroupFormSchema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => ({ path: issue.path.join("."), message: issue.message }));
}

describe("featureGroupFormSchema", () => {
  it("parses prices to numbers and trims names", () => {
    const parsed = featureGroupFormSchema.parse(group({ name: " Ekstralar ", options: [option({ name: " Peynir ", price: "12.5" })] }));

    expect(parsed.name).toBe("Ekstralar");
    expect(parsed.options).toEqual([{ id: "o1", name: "Peynir", price: 12.5, isDefault: false }]);
  });

  it("drops blank option rows instead of failing on them", () => {
    const parsed = featureGroupFormSchema.parse(group({ options: [option(), option({ id: "o2", name: "   " })] }));

    expect(parsed.options.map((entry) => entry.name)).toEqual(["Az pişmiş"]);
  });

  it("requires a group name", () => {
    expect(issues(group({ name: "" }))).toEqual([{ path: "name", message: "Özellik grup ismi zorunludur" }]);
  });

  it("needs at least one named option", () => {
    expect(issues(group({ options: [option({ name: "" })] }))).toEqual([
      { path: "options", message: "En az bir özellik ekleyin" },
    ]);
  });

  it("does not allow the same option twice in a group", () => {
    const result = issues(group({ options: [option(), option({ id: "o2", name: "AZ PİŞMİŞ" })] }));

    expect(result).toEqual([{ path: "options.1.name", message: "Bu özellik zaten eklendi" }]);
  });

  it("rejects an extra amount that is negative or not a number", () => {
    expect(issues(group({ options: [option({ price: "-5" })] }))).toEqual([
      { path: "options.0.price", message: "Tutar negatif olamaz" },
    ]);
    expect(issues(group({ options: [option({ price: "abc" })] }))).toEqual([
      { path: "options.0.price", message: "Geçerli bir tutar giriniz" },
    ]);
  });

  it("treats an empty price as free", () => {
    expect(featureGroupFormSchema.parse(group({ options: [option({ price: "" })] })).options[0]?.price).toBe(0);
  });

  it("allows only one default option in a single-choice group", () => {
    const options = [option({ isDefault: true }), option({ id: "o2", name: "Orta", isDefault: true })];

    expect(issues(group({ selectionType: "single", options }))).toEqual([
      { path: "options", message: "Tekli seçimde yalnızca bir varsayılan özellik olabilir" },
    ]);
    expect(issues(group({ selectionType: "multiple", options }))).toEqual([]);
  });
});
