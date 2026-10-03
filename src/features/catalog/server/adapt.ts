import type { Discount, DiscountType } from "../model/discount";
import type { FeatureGroup, FeatureOption, SelectionType } from "../model/feature-group";
import type { ApiDiscount, ApiFeatureGroup, ApiFeatureOption } from "./wire-types";

const lower = <T extends string>(value: string): T => value.toLowerCase() as T;
export const upper = (value: string): string => value.toUpperCase();

export const toDiscount = (discount: ApiDiscount): Discount => ({
  id: discount.id,
  name: discount.name,
  type: lower<DiscountType>(discount.type),
  amount: discount.amount,
});

const toFeatureOption = (option: ApiFeatureOption): FeatureOption => ({
  id: option.id,
  name: option.name,
  price: option.price,
  isDefault: option.isDefault,
});

export const toFeatureGroup = (group: ApiFeatureGroup): FeatureGroup => ({
  id: group.id,
  name: group.name,
  selectionType: lower<SelectionType>(group.selectionType),
  useRecipeProduct: group.useRecipeProduct,
  isRequired: group.isRequired,
  options: group.options.map(toFeatureOption),
});
