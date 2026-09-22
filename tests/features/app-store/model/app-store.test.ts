import { describe, expect, it } from "vitest";
import { APP_CATEGORIES, APPS, appsInCategory } from "@/features/app-store/model/app-store";

describe("appsInCategory", () => {
  it("returns every app for the catch-all category", () => {
    expect(appsInCategory(APPS, "all")).toEqual(APPS);
  });

  it("returns only the apps tagged with a given category", () => {
    const result = appsInCategory(APPS, "operations");

    expect(result.length).toBeGreaterThan(0);
    expect(result.every((app) => app.categories.includes("operations"))).toBe(true);
  });

  it("is an empty list for a category nothing is tagged with yet", () => {
    expect(appsInCategory(APPS, "hotel")).toEqual([]);
  });
});

describe("APP_CATEGORIES", () => {
  it("counts how many apps are actually in each category", () => {
    const operations = APP_CATEGORIES.find((category) => category.id === "operations");

    expect(operations?.count).toBe(appsInCategory(APPS, "operations").length);
  });
});
