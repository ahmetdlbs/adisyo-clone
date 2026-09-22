/**
 * Every static page of the app. `routes.test.ts` fails when a value here has no `page.tsx`,
 * so a link built from ROUTES can never point at a missing screen.
 */
export const ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  onboarding: "/onboarding",

  dashboard: "/dashboard",
  orders: "/orders",
  controlPage: "/control-page",
  kitchen: "/kitchen-detail",

  integrationMenuOperations: "/integration-menu-operations",
  productPairing: "/product-pairing",

  tableAreaDefinition: "/table-area-definition",
  productDefinition: "/product-definition",
  productUnits: "/product-units",
  features: "/features",
  vatDefinitions: "/vat-definitions",
  discounts: "/discounts",
  kitchenGroups: "/kitchen-groups",

  restaurantCustomers: "/restaurant-customers",
  restaurantPaidlesses: "/restaurant-paidlesses",
  serviceOperations: "/service-operations",
  stockList: "/stock-list",
  restaurantExpenses: "/restaurant-expenses",
  restaurantWastages: "/restaurant-wastages",

  users: "/users",
  rights: "/rights",

  reportSalesProducts: "/report-sales-products",
  reports: "/reports",
  shiftSales: "/shift-sales",
  restaurantStatistics: "/restaurant-statistics",
  stockProductQuantity: "/stock-product-quantity",
  wastageProductReport: "/wastage-product-report",
  reportingWizard: "/reporting-wizard",

  printerSettings: "/printer-settings",
  appStore: "/app-store",
  referral: "/referral",

  profile: "/profile",
  restaurantSettings: "/restaurant-settings",
  account: "/account",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
