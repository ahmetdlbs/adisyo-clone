import { ROUTES, type AppRoute } from "@/config/routes";

/** Mirrors api/'s `App.category` (prisma/schema.prisma) plus the "all" tab this screen adds on top. */
export const CATEGORY_IDS = [
  "all",
  "operations",
  "delivery",
  "payment",
  "courier",
  "einvoice",
  "data",
  "hotel",
  "loyalty",
  "stock",
  "reports",
  "users",
  "hardware",
] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

/** One row from `GET /apps-catalog` — see api/src/apps-catalog. Prices are kuruş, like everywhere else. */
export interface CatalogApp {
  id: string;
  key: string;
  name: string;
  description: string;
  category: Exclude<CategoryId, "all">;
  isCore: boolean;
  /** False for modules that are listed but not built (or discontinued): shown as "Yakında", cannot be bought. */
  isAvailable: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
}

export type EntitlementStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

/** One row from `GET /billing/entitlements` — the screen shows when a purchase renews. */
export interface AppEntitlement {
  appId: string;
  status: EntitlementStatus;
  expiresAt?: string | null;
}

const CATEGORY_LABELS: Record<CategoryId, string> = {
  all: "Tüm Uygulamalar",
  operations: "Restoran Operasyon",
  delivery: "Paket Sipariş",
  payment: "Ödeme Yöntemi",
  courier: "Kurye",
  einvoice: "E-Dönüşüm",
  data: "Veri Aktarımı & API",
  hotel: "Otel",
  loyalty: "Müşteri Sadakat",
  stock: "Stok",
  reports: "Raporlar",
  users: "Kullanıcılar",
  hardware: "Donanım",
};

/** Apps tagged with `category`, or every app for `"all"`. */
export function appsInCategory(apps: readonly CatalogApp[], category: CategoryId): readonly CatalogApp[] {
  return category === "all" ? apps : apps.filter((app) => app.category === category);
}

export function categoryOptions(apps: readonly CatalogApp[]) {
  return CATEGORY_IDS.map((id) => ({ id, label: CATEGORY_LABELS[id], count: appsInCategory(apps, id).length }));
}

/** An app the restaurant can use right now. `activeKeys` comes from the API, which already knows about expiry. */
export function isInstalled(app: CatalogApp, activeKeys: ReadonlySet<string>): boolean {
  return activeKeys.has(app.key);
}

/** When the purchase of `app` ends or renews, if it was bought (core apps never end). */
export function renewalDate(app: CatalogApp, entitlements: readonly AppEntitlement[]): string | null {
  if (app.isCore) return null;
  return entitlements.find((entitlement) => entitlement.appId === app.id && entitlement.status === "ACTIVE")?.expiresAt ?? null;
}

/** Where "Aç" / "Kur" takes you for an installed app; apps without a screen of their own have none. */
const APP_ROUTES: Readonly<Record<string, AppRoute>> = {
  "siparis-masa-yonetimi": ROUTES.orders,
  "mutfak-ekrani": ROUTES.kitchen,
  "urun-menu-tanimlama": ROUTES.productDefinition,
  "kdv-indirim-tanimlama": ROUTES.vatDefinitions,
  "kullanici-yonetimi": ROUTES.users,
  "temel-raporlar": ROUTES.reports,
  "musteri-veresiye": ROUTES.restaurantPaidlesses,
  "stok-listesi": ROUTES.stockList,
  "recete-maliyet-takibi": ROUTES.productDefinition,
  "ileri-raporlama-sihirbazi": ROUTES.reportingWizard,
  "yemeksepeti-entegrasyonu": ROUTES.integrationSettings,
  "trendyol-yemek-entegrasyonu": ROUTES.integrationSettings,
};

export const appRoute = (app: CatalogApp): AppRoute | undefined => APP_ROUTES[app.key];

/** Integration apps need credentials before they do anything, so their button says "Kurulum", not "Aç". */
export const isIntegrationApp = (app: CatalogApp): boolean => app.category === "delivery";
