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
  monthlyPrice: number;
  yearlyPrice: number;
}

export type EntitlementStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

/** One row from `GET /billing/entitlements` — only `appId`/`status` matter to this screen. */
export interface AppEntitlement {
  appId: string;
  status: EntitlementStatus;
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

/** An app the tenant currently holds an active entitlement for — core apps are entitled from signup. */
export function isInstalled(app: CatalogApp, entitlements: readonly AppEntitlement[]): boolean {
  return app.isCore || entitlements.some((entitlement) => entitlement.appId === app.id && entitlement.status === "ACTIVE");
}
