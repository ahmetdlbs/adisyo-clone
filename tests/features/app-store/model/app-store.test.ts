import { describe, expect, it } from "vitest";
import { appRoute, appsInCategory, categoryOptions, isInstalled, renewalDate, type AppEntitlement, type CatalogApp } from "@/features/app-store/model/app-store";

function app(overrides: Partial<CatalogApp> = {}): CatalogApp {
  return {
    id: "app-1",
    key: "yemeksepeti-entegrasyonu",
    name: "Yemek Sepeti Entegrasyonu",
    description: "d",
    category: "delivery",
    isCore: false,
    isAvailable: true,
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
  const active = new Set(["yemeksepeti-entegrasyonu", "siparis-masa-yonetimi"]);

  it("is true for an app whose key the API reports as active", () => {
    expect(isInstalled(app({ key: "yemeksepeti-entegrasyonu" }), active)).toBe(true);
    expect(isInstalled(app({ key: "siparis-masa-yonetimi", isCore: true }), active)).toBe(true);
  });

  it("is false for an app that is not active, even if it was bought before (expired)", () => {
    expect(isInstalled(app({ key: "mutfak-ekrani" }), active)).toBe(false);
  });
});

describe("renewalDate", () => {
  const entitlements: readonly AppEntitlement[] = [
    { appId: "app-1", status: "ACTIVE", expiresAt: "2026-11-03T00:00:00.000Z" },
    { appId: "app-2", status: "CANCELLED", expiresAt: "2026-11-03T00:00:00.000Z" },
  ];

  it("is the end date of an active purchase", () => {
    expect(renewalDate(app({ id: "app-1" }), entitlements)).toBe("2026-11-03T00:00:00.000Z");
  });

  it("is null for a cancelled, unbought or core app", () => {
    expect(renewalDate(app({ id: "app-2" }), entitlements)).toBeNull();
    expect(renewalDate(app({ id: "app-9" }), entitlements)).toBeNull();
    expect(renewalDate(app({ id: "app-1", isCore: true }), entitlements)).toBeNull();
  });
});

describe("appRoute", () => {
  it("points installed apps at their screen and leaves unbuilt ones without", () => {
    expect(appRoute(app({ key: "mutfak-ekrani" }))).toBe("/kitchen-detail");
    expect(appRoute(app({ key: "trendyol-yemek-entegrasyonu" }))).toBe("/integration-settings");
    expect(appRoute(app({ key: "e-fatura" }))).toBeUndefined();
  });
});
