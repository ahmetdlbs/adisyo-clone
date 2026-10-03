/**
 * Wire shapes returned by api/'s POS endpoints (Areas/Tables, Categories/Products, Orders). Enum-like fields
 * come back UPPERCASE (Prisma convention); `adapt.ts` lower-cases them to match the existing domain types in
 * `model/pos-state.ts` / `model/order.ts` exactly, so every screen and pure function built for those types
 * keeps working unchanged — only where the data comes from changes.
 */

export interface ApiArea {
  id: string;
  name: string;
  sortOrder: number;
}

export interface ApiTable {
  id: string;
  name: string;
  areaId: string;
  shape: "SQUARE" | "CIRCLE";
}

export interface ApiCategory {
  id: string;
  name: string;
}

export interface ApiRecipeLine {
  stockItemId: string;
  quantity: number;
}

export interface ApiPortion {
  id: string;
  name: string;
  isDefault: boolean;
  tablePrice: number;
  takeawayPrice: number;
  deliveryPrice: number;
  unitId: string | null;
  costAmount: number | null;
  recipeLines: ApiRecipeLine[];
}

export interface ApiFeatureGroupRef {
  id: string;
}

export interface ApiComboItem {
  itemProductId: string | null;
  itemPortionId: string | null;
  name: string;
  quantity: number;
}

export interface ApiProduct {
  id: string;
  categoryId: string;
  name: string;
  color: string | null;
  barcode: string | null;
  productCode: string | null;
  isFavorite: boolean;
  showOnSalesScreen: boolean;
  showOnKitchenScreen: boolean;
  vatExcluded: boolean;
  autoAskFeaturePortion: boolean;
  useRecipe: boolean;
  trackStock: boolean;
  isCombo: boolean;
  vatDefinitionId: string | null;
  kitchenGroupId: string | null;
  courseGroupId: string | null;
  portions: ApiPortion[];
  featureGroups: ApiFeatureGroupRef[];
  comboItems: ApiComboItem[];
}

export interface ApiOrderLine {
  id: string;
  productId: string | null;
  portionId: string | null;
  name: string;
  unitPrice: number;
  quantity: number;
  isComplimentary: boolean;
}

export interface ApiOrderPayment {
  id: string;
  method: string;
  amount: number;
  paidAt: string;
  lineIds: string[];
}

export interface ApiOrder {
  id: string;
  number: number;
  type: "TABLE" | "TAKEAWAY" | "DELIVERY";
  tableId: string | null;
  customerName: string | null;
  waiter: string;
  openedAt: string;
  stage: "PREPARING" | "READY" | "OUT_FOR_DELIVERY";
  status: "OPEN" | "PAID" | "CANCELLED";
  discountPercent: number;
  closedAt: string | null;
  lines: ApiOrderLine[];
  payments: ApiOrderPayment[];
  charges?: ApiOrderCharge[];
}

export interface ApiOrderCharge {
  which: "kuver" | "garsoniye";
  name: string;
  kind: "amount" | "percent";
  amount: number;
}
