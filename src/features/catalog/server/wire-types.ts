/**
 * Wire shapes returned by api/'s catalog endpoints (discounts, feature groups). Enum-like fields come back
 * UPPERCASE (Prisma convention); `adapt.ts` lower-cases them to match the existing lowercase domain types.
 */

export interface ApiDiscount {
  id: string;
  name: string;
  type: "PERCENT" | "AMOUNT";
  amount: number;
}

export interface ApiFeatureOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

export interface ApiFeatureGroup {
  id: string;
  name: string;
  selectionType: "SINGLE" | "MULTIPLE";
  useRecipeProduct: boolean;
  isRequired: boolean;
  options: ApiFeatureOption[];
}
