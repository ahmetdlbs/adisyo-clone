import { describe, expect, it } from "vitest";
import {
  MAX_VAT_DEFINITIONS,
  removeVat,
  saveVat,
  vatFormSchema,
  type VatDefinition,
} from "@/features/catalog/model/vat";

const FOOD: VatDefinition = { id: "1", name: "Yiyecek", rate: 10, isDefault: true };
const DRINK: VatDefinition = { id: "2", name: "İçecek", rate: 10, isDefault: false };

let nextId = 0;
const createId = () => `new-${++nextId}`;

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

describe("saveVat", () => {
  it("makes the first definition the default", () => {
    const result = saveVat([], { name: "Yiyecek", rate: 10, isDefault: false }, null, createId);

    expect(result).toHaveLength(1);
    expect(result[0]?.isDefault).toBe(true);
  });

  it("appends further definitions as non-default", () => {
    const result = saveVat([FOOD], { name: "İçecek", rate: 10, isDefault: false }, null, createId);

    expect(result.map((vat) => vat.isDefault)).toEqual([true, false]);
  });

  it("moves the default when a new definition asks for it", () => {
    const result = saveVat([FOOD], { name: "İçecek", rate: 10, isDefault: true }, null, createId);

    expect(result.map((vat) => [vat.name, vat.isDefault])).toEqual([
      ["Yiyecek", false],
      ["İçecek", true],
    ]);
  });

  it("edits a definition in place", () => {
    const result = saveVat([FOOD, DRINK], { name: "İçecek %20", rate: 20, isDefault: false }, "2", createId);

    expect(result[1]).toEqual({ id: "2", name: "İçecek %20", rate: 20, isDefault: false });
  });

  it("keeps a default when the default itself is switched off", () => {
    const result = saveVat([FOOD, DRINK], { name: "Yiyecek", rate: 10, isDefault: false }, "1", createId);

    expect(result.filter((vat) => vat.isDefault)).toHaveLength(1);
  });

  it("refuses to exceed the maximum number of definitions", () => {
    const full = Array.from({ length: MAX_VAT_DEFINITIONS }, (_, index) => ({
      id: String(index),
      name: `Grup ${index}`,
      rate: 10,
      isDefault: index === 0,
    }));

    expect(() => saveVat(full, { name: "Fazla", rate: 10, isDefault: false }, null, createId)).toThrow(RangeError);
  });

  it("does not mutate the input", () => {
    const input = [FOOD];
    const snapshot = structuredClone(input);

    saveVat(input, { name: "İçecek", rate: 10, isDefault: true }, null, createId);

    expect(input).toEqual(snapshot);
  });
});

describe("removeVat", () => {
  it("removes a non-default definition", () => {
    expect(removeVat([FOOD, DRINK], "2")).toEqual([FOOD]);
  });

  it("promotes the first remaining definition when the default is removed", () => {
    const result = removeVat([FOOD, DRINK], "1");

    expect(result).toEqual([{ ...DRINK, isDefault: true }]);
  });

  it("can remove the last definition", () => {
    expect(removeVat([FOOD], "1")).toEqual([]);
  });
});
