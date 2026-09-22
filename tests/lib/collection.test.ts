import { describe, expect, it } from "vitest";
import { isNameTaken, removeById, upsertById } from "@/lib/collection";

describe("isNameTaken", () => {
  const items = [
    { id: "1", name: "Tam" },
    { id: "2", name: "Kilo" },
  ];

  it("finds an existing name ignoring case and surrounding spaces", () => {
    expect(isNameTaken(items, "  tam ")).toBe(true);
  });

  it("keeps dotted and dotless i apart, the Turkish way", () => {
    expect(isNameTaken(items, "KILO")).toBe(false);
    expect(isNameTaken(items, "KİLO")).toBe(true);
  });

  it("does not count the item being edited against itself", () => {
    expect(isNameTaken(items, "Tam", "1")).toBe(false);
    expect(isNameTaken(items, "Kilo", "1")).toBe(true);
  });

  it("is false for a free name", () => {
    expect(isNameTaken(items, "Adet")).toBe(false);
  });
});

interface Item {
  id: string;
  name: string;
}

const ITEMS: readonly Item[] = [
  { id: "1", name: "Tam" },
  { id: "2", name: "Yarım" },
];

describe("upsertById", () => {
  it("replaces the item that has the same id, keeping its position", () => {
    const result = upsertById(ITEMS, { id: "1", name: "Bir buçuk" });

    expect(result).toEqual([
      { id: "1", name: "Bir buçuk" },
      { id: "2", name: "Yarım" },
    ]);
  });

  it("appends an item with a new id", () => {
    const result = upsertById(ITEMS, { id: "3", name: "Adet" });

    expect(result.map((item) => item.id)).toEqual(["1", "2", "3"]);
  });

  it("never mutates the input", () => {
    const snapshot = structuredClone(ITEMS);

    upsertById(ITEMS, { id: "1", name: "Değişti" });
    upsertById(ITEMS, { id: "9", name: "Yeni" });

    expect(ITEMS).toEqual(snapshot);
  });
});

describe("removeById", () => {
  it("drops the item with that id", () => {
    expect(removeById(ITEMS, "1")).toEqual([{ id: "2", name: "Yarım" }]);
  });

  it("returns an equal list when the id is unknown", () => {
    expect(removeById(ITEMS, "nope")).toEqual(ITEMS);
  });

  it("never mutates the input", () => {
    const snapshot = structuredClone(ITEMS);

    removeById(ITEMS, "1");

    expect(ITEMS).toEqual(snapshot);
  });
});
