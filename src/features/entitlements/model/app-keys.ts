/** App Store keys the screens depend on; the catalog in `api/src/catalog/catalog-data.ts` defines them all. */
export const APP_KEYS = {
  kitchenScreen: "mutfak-ekrani",
  recipeCost: "recete-maliyet-takibi",
  advancedReporting: "ileri-raporlama-sihirbazi",
  multiPrinter: "coklu-yazici-yonlendirme",
  digitalMenu: "dijital-menu-qr",
  yemeksepeti: "yemeksepeti-entegrasyonu",
  trendyol: "trendyol-yemek-entegrasyonu",
} as const;

/** A screen that is open when any one of these apps is active. */
export type AppRequirement = readonly string[];

export const hasAnyApp = (active: ReadonlySet<string>, requirement: AppRequirement): boolean =>
  requirement.some((key) => active.has(key));
