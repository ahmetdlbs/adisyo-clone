export const CATEGORY_IDS = ["all", "operations", "delivery", "payment", "courier", "einvoice", "data", "hotel", "loyalty"] as const;
export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface AppListing {
  id: string;
  name: string;
  description: string;
  categories: readonly Exclude<CategoryId, "all">[];
  isInstalled: boolean;
  /** null for an installed, free app. */
  price: string | null;
}

export const APPS: readonly AppListing[] = [
  {
    id: "customer-screen",
    name: "Müşteri Bilgi Ekranı",
    description: "Sipariş alırken müşteriye anlık sepet özeti gösterin, şeffaf ve güven veren bir deneyim sunun.",
    categories: ["operations"],
    isInstalled: true,
    price: null,
  },
  {
    id: "caller-id",
    name: "Android Caller ID",
    description: "Gelen aramaları bilgisayarınıza ileterek arayan müşterinin sipariş ve iletişim bilgilerini anında gösterin.",
    categories: ["operations"],
    isInstalled: true,
    price: null,
  },
  {
    id: "satisfaction-survey",
    name: "Müşteri Memnuniyeti",
    description: "Fişteki QR ile müşterilerinizden anket yanıtı toplayın.",
    categories: ["operations", "loyalty"],
    isInstalled: false,
    price: "Pro Plan",
  },
  {
    id: "yemeksepeti",
    name: "Yemek Sepeti (Deliveryhero)",
    description: "Yemek Sepeti üzerinden gelen siparişleri doğrudan adisyona düşürün.",
    categories: ["delivery"],
    isInstalled: false,
    price: "+₺225 / ay",
  },
  {
    id: "getir-yemek",
    name: "Getir Yemek",
    description: "Getir Yemek siparişlerini doğrudan adisyona düşürün.",
    categories: ["delivery"],
    isInstalled: false,
    price: "+₺225 / ay",
  },
  {
    id: "trendyol-yemek",
    name: "Trendyol Yemek",
    description: "Trendyol Yemek siparişlerini doğrudan adisyona düşürün.",
    categories: ["delivery"],
    isInstalled: false,
    price: "+₺225 / ay",
  },
] as const;

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
};

/** Apps tagged with `category`, or every app for `"all"`. */
export function appsInCategory(apps: readonly AppListing[], category: CategoryId): readonly AppListing[] {
  return category === "all" ? apps : apps.filter((app) => app.categories.includes(category));
}

export const APP_CATEGORIES = CATEGORY_IDS.map((id) => ({ id, label: CATEGORY_LABELS[id], count: appsInCategory(APPS, id).length }));
