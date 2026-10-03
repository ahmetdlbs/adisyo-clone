import type { Kurus } from "@/lib/money";
import { remaining, type Order, type OrderType } from "./order";

export interface Area {
  id: string;
  name: string;
}

export type TableShape = "square" | "circle";

export interface TableDefinition {
  id: string;
  name: string;
  areaId: string;
  shape: TableShape;
}

export interface Category {
  id: string;
  name: string;
}

/** One stock item ("Stok Kartı") a portion's sale consumes, and how much of it. */
export interface RecipeLine {
  stockItemId: string;
  quantity: number;
}

/** A sellable unit of a product ("Tam", "Yarım", ...), priced separately per order channel. */
export interface Portion {
  id: string;
  name: string;
  isDefault: boolean;
  tablePrice: Kurus;
  takeawayPrice: Kurus;
  deliveryPrice: Kurus;
  unitId?: string;
  /** Maliyet Tutarı, kuruş. */
  costAmount?: Kurus;
  /** Raw materials this portion's sale consumes; empty unless the product's useRecipe/trackStock is on. */
  recipeLines: readonly RecipeLine[];
}

/** One bundled line inside a combo product ("Menü Tanımla"): which product+portion, and how many. */
export interface ComboItem {
  productId: string;
  portionId: string;
  /** "Product (Portion)" as it read when this line was saved — survives the product/portion being renamed. */
  name: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  /** Hex color for the tile in the order screen's menu panel. */
  color?: string;
  barcode?: string;
  productCode?: string;
  isFavorite: boolean;
  showOnSalesScreen: boolean;
  showOnKitchenScreen: boolean;
  vatExcluded: boolean;
  autoAskFeaturePortion: boolean;
  /** "Reçeteli ürün kullan": each portion may list several raw materials it consumes. */
  useRecipe: boolean;
  /** "Stok takibi yap": simpler than useRecipe — each portion maps to at most one stock item, 1-for-1. */
  trackStock: boolean;
  /** "Menü Tanımla": this product is a combo bundling the products in comboItems, at its own portion price. */
  isCombo: boolean;
  vatDefinitionId?: string;
  kitchenGroupId?: string;
  courseGroupId?: string;
  portions: readonly Portion[];
  featureGroupIds: readonly string[];
  comboItems: readonly ComboItem[];
}

/** The portion that is added when nothing else is specified: the one flagged default, else the first. */
export function defaultPortion(product: Pick<Product, "portions">): Portion | undefined {
  return product.portions.find((portion) => portion.isDefault) ?? product.portions[0];
}

/** Real POS pricing varies by where the order came from — dine-in, takeaway or a delivery commission. */
export function portionPrice(portion: Portion, type: OrderType): Kurus {
  if (type === "takeaway") return portion.takeawayPrice;
  if (type === "delivery") return portion.deliveryPrice;
  return portion.tablePrice;
}

/**
 * The slice of the live POS snapshot (`store/pos-provider.tsx`) these read-only helpers need. Kept narrow
 * so they work whether the caller has the whole snapshot or just these two pieces of it.
 */
export interface FloorAndOrders {
  tables: readonly TableDefinition[];
  orders: readonly Order[];
}

export const orderForTable = (state: FloorAndOrders, tableId: string): Order | undefined =>
  state.orders.find((order) => order.type === "table" && order.tableId === tableId);

/** What the order is called on screen: its table, or a fixed name for takeaway and delivery. */
export function orderTitle(state: FloorAndOrders, order: Order): string {
  if (order.type === "takeaway") return "Gel Al Sipariş";
  if (order.type === "delivery") return "Paket Sipariş";
  return state.tables.find((table) => table.id === order.tableId)?.name ?? "Silinmiş masa";
}

/** A table is occupied once something is on its bill; an order that was just opened does not count. */
export const isTableOccupied = (state: FloorAndOrders, tableId: string): boolean =>
  (orderForTable(state, tableId)?.lines.length ?? 0) > 0;

/** What is still to be collected across every open order. */
export const openOrderTotal = (state: Pick<FloorAndOrders, "orders">): Kurus =>
  state.orders.reduce((sum, order) => sum + remaining(order), 0);
