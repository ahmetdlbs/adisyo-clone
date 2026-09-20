import { appPath } from "./paths";

// Drawer menu as the demo account sees it on pos.adisyo.com. Labels and order follow the UI,
// icons and routes come from the original app's menu definition (`routerLink` / `icon`).
// Entries the account cannot see (B2B, Sipariş Durum Ekranı, Entegrasyon Durumları, ...) are omitted here
// but their pages exist under /app.

export type NavBadge = "Yeni" | "Yepyeni";

export interface NavLeaf {
  label: string;
  icon: string;
  path: string;
  badge?: NavBadge;
  isHighlighted?: boolean;
}

export interface NavGroup {
  label: string;
  icon: string;
  children: readonly NavLeaf[];
}

export type NavEntry = NavLeaf | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "children" in entry;

export const NAVIGATION: readonly NavEntry[] = [
  { label: "Ana Sayfa", icon: "home", path: appPath("dashboard") },
  {
    label: "Entegrasyon İşlemleri",
    icon: "widgets",
    children: [
      { label: "Ürün Eşleştirme Ekranı", icon: "room_service", path: appPath("product-pairing") },
      {
        label: "Entegrasyon İşlemleri",
        icon: "checklist",
        path: appPath("integration-menu-operations"),
        badge: "Yeni",
      },
    ],
  },
  { label: "Dijital Menü", icon: "vibration", path: appPath("digital-menu"), badge: "Yepyeni" },
  {
    label: "Tanımlamalar",
    icon: "assignment_turned_in",
    children: [
      { label: "Masa / Bölgeler", icon: "view_quilt", path: appPath("table-area-definition") },
      { label: "Menü / Ürünler", icon: "restaurant_menu", path: appPath("product-definition") },
      { label: "Birimler", icon: "library_books", path: appPath("product-units") },
      { label: "Özellikler", icon: "view_list", path: appPath("features") },
      // the original uses a custom SVG here; a stand-in icon until the drawer gets its fidelity pass
      { label: "Kdv Oranları", icon: "account_balance", path: appPath("vat-definitions") },
      { label: "İndirimler", icon: "label", path: appPath("discounts") },
      { label: "Mutfak Grupları", icon: "dvr", path: appPath("kitchen-groups") },
      { label: "Müşteriler", icon: "assignment_ind", path: appPath("restaurant-customers") },
      { label: "Ödenmezler", icon: "badge", path: appPath("restaurant-paidlesses") },
      // custom SVG in the original as well
      { label: "Kuver/Garsoniye", icon: "manage_accounts", path: appPath("service-operations") },
    ],
  },
  { label: "Sipariş", icon: "shopping_basket", path: appPath("control-page") },
  { label: "Mutfak", icon: "tv", path: appPath("kitchen") },
  {
    label: "İşlemler",
    icon: "layers",
    children: [
      { label: "Stok İşlemleri", icon: "local_shipping", path: appPath("stock-list") },
      { label: "Gider / Masraf İşlemleri", icon: "trending_down", path: appPath("restaurant-expenses") },
      { label: "Zayi İşlemleri", icon: "broken_image", path: appPath("restaurant-wastages") },
    ],
  },
  {
    label: "Kullanıcılar",
    icon: "people",
    children: [
      { label: "Kullanıcılar", icon: "people", path: appPath("users") },
      { label: "Yetkiler", icon: "verified_user", path: appPath("rights") },
    ],
  },
  {
    label: "Raporlar",
    icon: "pie_chart",
    children: [
      { label: "Ürün Satış Raporu", icon: "show_chart", path: appPath("report-sales-products") },
      { label: "Gün Sonu Raporu", icon: "monetization_on", path: appPath("report-settlement") },
      { label: "Vardiya Satış Raporu", icon: "request_quote", path: appPath("shift-sales") },
      { label: "Restaurant İstatistikleri", icon: "pie_chart", path: appPath("restaurant-statistics") },
      { label: "Stok Durum Raporu", icon: "local_shipping", path: appPath("stock-product-quantity") },
      { label: "Fire Raporu", icon: "inventory_2", path: appPath("wastage-product-report") },
      { label: "Rapor Sihirbazı", icon: "pivot_table_chart", path: appPath("reporting-wizard") },
    ],
  },
  { label: "Yazıcılar", icon: "print", path: appPath("printer-settings") },
  { label: "Uygulama Mağazası", icon: "apps", path: appPath("app-store") },
  {
    label: "Tavsiye Et ve Kazan",
    icon: "card_giftcard",
    path: appPath("referral"),
    badge: "Yeni",
    isHighlighted: true,
  },
];

/** Label of the group whose child is `path`, so the drawer can open it by default. */
export function groupLabelForPath(pathname: string): string | null {
  const group = NAVIGATION.filter(isNavGroup).find((entry) =>
    entry.children.some((child) => child.path === pathname)
  );
  return group?.label ?? null;
}
