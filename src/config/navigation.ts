import {
  Archive,
  Briefcase,
  CheckSquare,
  DollarSign,
  Home,
  Layers,
  LayoutGrid,
  PieChart,
  Printer,
  Receipt,
  ShoppingBag,
  Sliders,
  Smartphone,
  TrendingUp,
  Truck,
  Tv,
  Users,
  type LucideIcon,
} from "lucide-react";
import { APP_KEYS, hasAnyApp, type AppRequirement } from "@/features/entitlements/model/app-keys";
import { ROUTES, type AppRoute } from "./routes";

export type NavBadge = "Yeni" | "Yepyeni";

export interface NavLink {
  label: string;
  icon?: LucideIcon;
  /** Omit for entries whose page does not exist yet; they render disabled. */
  href?: AppRoute;
  badge?: NavBadge;
  /** Shown only while one of these App Store apps is active. Omit for the always-on core screens. */
  requires?: AppRequirement;
}

export interface NavGroup {
  label: string;
  icon: LucideIcon;
  children: readonly NavLink[];
  requires?: AppRequirement;
}

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => "children" in entry;

/** The delivery-platform apps; their screens are open when the restaurant has any of them. */
export const DELIVERY_APPS: AppRequirement = [APP_KEYS.yemeksepeti, APP_KEYS.trendyol];

/** Drawer menu: the single source of truth for labels, order and destinations. */
export const NAVIGATION: readonly NavEntry[] = [
  { label: "Ana Sayfa", icon: Home, href: ROUTES.dashboard },
  {
    label: "Entegrasyon İşlemleri",
    icon: Layers,
    requires: DELIVERY_APPS,
    children: [
      { label: "Bağlantılar", href: ROUTES.integrationSettings },
      { label: "Menü Operasyonları", href: ROUTES.integrationMenuOperations },
      { label: "Ürün Eşleştirme", href: ROUTES.productPairing },
    ],
  },
  { label: "Dijital Menü", icon: Smartphone, badge: "Yepyeni", requires: [APP_KEYS.digitalMenu] },
  {
    label: "Tanımlamalar",
    icon: CheckSquare,
    children: [
      { label: "Masa / Bölgeler", href: ROUTES.tableAreaDefinition },
      { label: "Menü / Ürünler", href: ROUTES.productDefinition },
      { label: "Ürün Birimleri", href: ROUTES.productUnits },
      { label: "Özellikler", href: ROUTES.features },
      { label: "KDV Tanımlamaları", href: ROUTES.vatDefinitions },
      { label: "İndirimler", href: ROUTES.discounts },
      { label: "Mutfak Grupları", href: ROUTES.kitchenGroups },
      { label: "Marş Grupları", href: ROUTES.courseGroups },
    ],
  },
  { label: "Sipariş", icon: ShoppingBag, href: ROUTES.orders },
  { label: "Mutfak", icon: Tv, href: ROUTES.kitchen, requires: [APP_KEYS.kitchenScreen] },
  {
    label: "İşlemler",
    icon: Briefcase,
    children: [
      { label: "Müşteriler", href: ROUTES.restaurantCustomers },
      { label: "Veresiye", href: ROUTES.restaurantPaidlesses },
      { label: "Servis İşlemleri", href: ROUTES.serviceOperations },
      { label: "Kontrol Ekranı", href: ROUTES.controlPage },
      { label: "Stok Listesi", href: ROUTES.stockList },
      { label: "Gider / Masraf İşlemleri", href: ROUTES.restaurantExpenses },
      { label: "Fireler", href: ROUTES.restaurantWastages },
    ],
  },
  {
    label: "Kullanıcılar",
    icon: Users,
    children: [
      { label: "Kullanıcılar", href: ROUTES.users },
      { label: "Haklar", href: ROUTES.rights },
    ],
  },
  {
    label: "Raporlar",
    icon: PieChart,
    children: [
      { label: "Ürün Satış Raporu", icon: TrendingUp, href: ROUTES.reportSalesProducts },
      { label: "Gün Sonu Raporu", icon: DollarSign, href: ROUTES.reports },
      { label: "Vardiya Satış Raporu", icon: Receipt, href: ROUTES.shiftSales },
      { label: "Restaurant İstatistikleri", icon: PieChart, href: ROUTES.restaurantStatistics },
      { label: "Stok Durum Raporu", icon: Truck, href: ROUTES.stockProductQuantity },
      { label: "Fire Raporu", icon: Archive, href: ROUTES.wastageProductReport },
      { label: "Rapor Sihirbazı", icon: Sliders, href: ROUTES.reportingWizard, requires: [APP_KEYS.advancedReporting] },
    ],
  },
  { label: "Yazıcılar", icon: Printer, href: ROUTES.printerSettings, requires: [APP_KEYS.multiPrinter] },
  { label: "Uygulama Mağazası", icon: LayoutGrid, href: ROUTES.appStore },
];

const isOpen = (entry: { requires?: AppRequirement }, active: ReadonlySet<string>) => !entry.requires || hasAnyApp(active, entry.requires);

/** The menu a restaurant gets to see: entries (and groups left with no entries) whose app it has not bought are dropped. */
export function visibleNavigation(entries: readonly NavEntry[], active: ReadonlySet<string>): NavEntry[] {
  return entries.flatMap((entry): NavEntry[] => {
    if (!isOpen(entry, active)) return [];
    if (!isNavGroup(entry)) return [entry];
    const children = entry.children.filter((child) => isOpen(child, active));
    return children.length > 0 ? [{ ...entry, children }] : [];
  });
}
