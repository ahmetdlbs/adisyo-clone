import { describe, expect, it } from "vitest";
import { appsInCategory, categoryOptions, isInstalled, type AppEntitlement, type CatalogApp } from "@/features/app-store/model/app-store";

function app(overrides: Partial<CatalogApp> = {}): CatalogApp {
  return {
    id: "app-1",
    key: "yemeksepeti-entegrasyonu",
    name: "Yemek Sepeti Entegrasyonu",
    description: "d",
    category: "delivery",
    isCore: false,
    monthlyPrice: 22500,
    yearlyPrice: 225000,
    ...overrides,
  };
}

const APPS: readonly CatalogApp[] = [
  app({ id: "app-1", category: "delivery" }),
  app({ id: "app-2", category: "operations", name: "Müşteri Bilgi Ekranı" }),
  app({ id: "app-3", category: "operations", name: "Mutfak Ekranı", isCore: true, monthlyPrice: 0, yearlyPrice: 0 }),
];

describe("appsInCategory", () => {
  it("returns every app for the catch-all category", () => {
    expect(appsInCategory(APPS, "all")).toEqual(APPS);
  });

  it("returns only the apps tagged with a given category", () => {
    const result = appsInCategory(APPS, "operations");

    expect(result.map((a) => a.id)).toEqual(["app-2", "app-3"]);
  });

  it("is an empty list for a category nothing is tagged with yet", () => {
    expect(appsInCategory(APPS, "hotel")).toEqual([]);
  });
});

describe("categoryOptions", () => {
  it("counts how many apps are actually in each category", () => {
    const operations = categoryOptions(APPS).find((category) => category.id === "operations");

    expect(operations?.count).toBe(2);
  });

  it("counts every app under the catch-all category", () => {
    const all = categoryOptions(APPS).find((category) => category.id === "all");

    expect(all?.count).toBe(APPS.length);
  });

  it("labels every one of the 12 catalog categories plus the catch-all", () => {
    expect(categoryOptions(APPS)).toHaveLength(13);
  });
});

describe("isInstalled", () => {
  const entitlements: readonly AppEntitlement[] = [
    { appId: "app-1", status: "ACTIVE" },
    { appId: "app-2", status: "CANCELLED" },
  ];

  it("is true for a core app even without an explicit entitlement row", () => {
    expect(isInstalled(app({ id: "app-99", isCore: true }), [])).toBe(true);
  });

  it("is true for a non-core app with an active entitlement", () => {
    expect(isInstalled(app({ id: "app-1" }), entitlements)).toBe(true);
  });

  it("is false for a non-core app with no entitlement at all", () => {
    expect(isInstalled(app({ id: "app-3" }), entitlements)).toBe(false);
  });

  it("is false for a non-core app whose entitlement is no longer active", () => {
    expect(isInstalled(app({ id: "app-2" }), entitlements)).toBe(false);
  });
});
