import type { Kurus } from "@/lib/money";
import { canClose, remaining, type Order, type OrderType } from "./order";

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

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: Kurus;
  barcode?: string;
  isFavorite: boolean;
}

/** An order that left the floor: paid in full, or cancelled. Cancelled orders are kept so voids stay auditable. */
export interface ClosedOrder {
  order: Order;
  outcome: "paid" | "cancelled";
  closedAt: string;
}

/** Everything the POS knows: the menu and floor plan, the open orders and the finished ones. */
export interface PosState {
  areas: readonly Area[];
  tables: readonly TableDefinition[];
  categories: readonly Category[];
  products: readonly Product[];
  orders: readonly Order[];
  history: readonly ClosedOrder[];
  nextOrderNumber: number;
}

export const createEmptyPosState = (): PosState => ({
  areas: [],
  tables: [],
  categories: [],
  products: [],
  orders: [],
  history: [],
  nextOrderNumber: 1,
});

// ── Reading ─────────────────────────────────────────────────────────────────

export const orderForTable = (state: PosState, tableId: string): Order | undefined =>
  state.orders.find((order) => order.type === "table" && order.tableId === tableId);

/** What the order is called on screen: its table, or a fixed name for takeaway and delivery. */
export function orderTitle(state: PosState, order: Order): string {
  if (order.type === "takeaway") return "Gel Al Sipariş";
  if (order.type === "delivery") return "Paket Sipariş";
  return state.tables.find((table) => table.id === order.tableId)?.name ?? "Silinmiş masa";
}

/** A table is occupied once something is on its bill; an order that was just opened does not count. */
export const isTableOccupied = (state: PosState, tableId: string): boolean =>
  (orderForTable(state, tableId)?.lines.length ?? 0) > 0;

/** What is still to be collected across every open order. */
export const openOrderTotal = (state: PosState): Kurus => state.orders.reduce((sum, order) => sum + remaining(order), 0);

// ── Changing ────────────────────────────────────────────────────────────────

const isEmpty = (order: Order) => order.lines.length === 0 && order.payments.length === 0;

function findOrder(state: PosState, orderId: string): Order {
  const order = state.orders.find((candidate) => candidate.id === orderId);
  if (!order) throw new Error("Sipariş bulunamadı");
  return order;
}

const withoutOrder = (state: PosState, orderId: string) => state.orders.filter((order) => order.id !== orderId);

export interface NewOrder {
  id: string;
  type: OrderType;
  tableId: string | null;
  customerName?: string;
  waiter: string;
  now: Date;
}

export function createOrder(state: PosState, input: NewOrder): PosState {
  if (input.type === "table") {
    if (input.tableId === null) throw new Error("Masa siparişi için masa gerekli");
    if (!state.tables.some((table) => table.id === input.tableId)) throw new Error("Masa bulunamadı");
    if (orderForTable(state, input.tableId)) throw new Error("Bu masada açık sipariş var");
  }

  const order: Order = {
    id: input.id,
    number: state.nextOrderNumber,
    type: input.type,
    tableId: input.type === "table" ? input.tableId : null,
    ...(input.customerName ? { customerName: input.customerName } : {}),
    waiter: input.waiter,
    openedAt: input.now.toISOString(),
    stage: "preparing",
    lines: [],
    discountPercent: 0,
    payments: [],
  };
  return { ...state, orders: [...state.orders, order], nextOrderNumber: state.nextOrderNumber + 1 };
}

/**
 * Applies `updater` to one order. An order emptied by it stays open, so a bill can be refilled after its last
 * item is taken off; it already shows as a free table. Leaving the screen cleans up via {@link discardEmptyOrder}.
 */
export function updateOrder(state: PosState, orderId: string, updater: (order: Order) => Order): PosState {
  const next = updater(findOrder(state, orderId));
  return { ...state, orders: state.orders.map((order) => (order.id === orderId ? next : order)) };
}

/** Moves a fully settled order to the history. Refuses while an amount is still due. */
export function closeOrder(state: PosState, orderId: string, now: Date): PosState {
  const order = findOrder(state, orderId);
  if (!canClose(order)) throw new Error("Ödenecek tutar var");
  return {
    ...state,
    orders: withoutOrder(state, orderId),
    history: [...state.history, { order, outcome: "paid", closedAt: now.toISOString() }],
  };
}

export function cancelOrder(state: PosState, orderId: string, now: Date): PosState {
  const order = findOrder(state, orderId);
  return {
    ...state,
    orders: withoutOrder(state, orderId),
    history: [...state.history, { order, outcome: "cancelled", closedAt: now.toISOString() }],
  };
}

/** Drops an order nothing was ever added to (someone opened it and walked away). */
export function discardEmptyOrder(state: PosState, orderId: string): PosState {
  const order = state.orders.find((candidate) => candidate.id === orderId);
  return order && isEmpty(order) ? { ...state, orders: withoutOrder(state, orderId) } : state;
}

export function moveOrderToTable(state: PosState, orderId: string, tableId: string): PosState {
  const order = findOrder(state, orderId);
  if (order.type !== "table") throw new Error("Yalnızca masa siparişi taşınabilir");
  if (!state.tables.some((table) => table.id === tableId)) throw new Error("Masa bulunamadı");
  if (orderForTable(state, tableId)) throw new Error("Hedef masada açık sipariş var");
  return { ...state, orders: state.orders.map((candidate) => (candidate.id === orderId ? { ...candidate, tableId } : candidate)) };
}
