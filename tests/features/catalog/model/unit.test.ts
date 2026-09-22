import { describe, expect, it } from "vitest";
import { createUnitFormSchema, type Unit } from "@/features/catalog/model/unit";

const UNITS: readonly Unit[] = [
  { id: "1", name: "Tam" },
  { id: "2", name: "Yarım" },
];

function messages(schema: ReturnType<typeof createUnitFormSchema>, input: unknown): string[] {
  const result = schema.safeParse(input);
  return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe("createUnitFormSchema", () => {
  it("accepts a new name and trims it", () => {
    const result = createUnitFormSchema(UNITS, null).parse({ name: "  Adet  " });

    expect(result).toEqual({ name: "Adet" });
  });

  it("requires a name", () => {
    expect(messages(createUnitFormSchema(UNITS, null), { name: "   " })).toEqual(["Birim adı zorunludur"]);
  });

  it("limits the name length", () => {
    expect(messages(createUnitFormSchema(UNITS, null), { name: "a".repeat(31) })).toEqual([
      "Birim adı en fazla 30 karakter olabilir",
    ]);
  });

  it("rejects a name that already exists, ignoring case the Turkish way", () => {
    expect(messages(createUnitFormSchema(UNITS, null), { name: "tam" })).toEqual(["Bu birim zaten tanımlı"]);
    expect(messages(createUnitFormSchema(UNITS, null), { name: "YARIM" })).toEqual(["Bu birim zaten tanımlı"]);
  });

  it("treats dotted and dotless i as different letters", () => {
    const schema = createUnitFormSchema([{ id: "1", name: "Kilo" }], null);

    expect(messages(schema, { name: "KILO" })).toEqual([]); // dotless I is not "i"
    expect(messages(schema, { name: "KİLO" })).toEqual(["Bu birim zaten tanımlı"]);
  });

  it("lets the unit being edited keep its own name", () => {
    expect(messages(createUnitFormSchema(UNITS, "1"), { name: "Tam" })).toEqual([]);
  });

  it("still rejects renaming onto another unit", () => {
    expect(messages(createUnitFormSchema(UNITS, "1"), { name: "Yarım" })).toEqual(["Bu birim zaten tanımlı"]);
  });
});
