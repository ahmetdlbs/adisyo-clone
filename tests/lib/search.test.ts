import { describe, expect, it } from "vitest";
import { filterByQuery, matchesQuery } from "@/lib/search";

describe("matchesQuery", () => {
  it("matches a substring regardless of case", () => {
    expect(matchesQuery("Karışık Pizza", "pizza")).toBe(true);
    expect(matchesQuery("Karışık Pizza", "KARIŞIK")).toBe(true);
  });

  it("treats an empty or blank query as matching everything", () => {
    expect(matchesQuery("Çay", "")).toBe(true);
    expect(matchesQuery("Çay", "   ")).toBe(true);
  });

  it("does not match text that is absent", () => {
    expect(matchesQuery("Çay", "kahve")).toBe(false);
  });

  it("folds case the Turkish way, so dotted and dotless i stay distinct", () => {
    expect(matchesQuery("Kilo", "KİLO")).toBe(true);
    expect(matchesQuery("Kilo", "KILO")).toBe(false);
    expect(matchesQuery("ISLAK", "ıslak")).toBe(true);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(matchesQuery("Çay", "  çay ")).toBe(true);
  });
});

describe("filterByQuery", () => {
  const items = [
    { name: "Çay", note: "sıcak" },
    { name: "Kahve", note: "sıcak" },
    { name: "Limonata", note: "soğuk" },
  ];

  it("keeps the items whose text matches", () => {
    expect(filterByQuery(items, "ka", (item) => item.name)).toEqual([items[1]]);
  });

  it("returns every item for an empty query", () => {
    expect(filterByQuery(items, "", (item) => item.name)).toEqual(items);
  });

  it("can search across several fields", () => {
    expect(filterByQuery(items, "soğuk", (item) => `${item.name} ${item.note}`)).toEqual([items[2]]);
  });

  it("never mutates the input", () => {
    const snapshot = structuredClone(items);

    filterByQuery(items, "çay", (item) => item.name);

    expect(items).toEqual(snapshot);
  });
});
