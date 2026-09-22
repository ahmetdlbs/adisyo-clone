import type { Kurus } from "@/lib/money";
import { lineTotal, orderTotal, PAYMENT_METHODS, type PaymentMethod } from "./order";
import { isTableOccupied, type ClosedOrder, type PosState } from "./pos-state";

const HOURS_IN_DAY = 24;

export interface HourlySales {
  hour: number;
  amount: Kurus;
}

export interface MethodSales {
  method: PaymentMethod;
  amount: Kurus;
  /** Whole percent of everything settled today. */
  share: number;
}

/** What the dashboard shows about today: bills that left the floor on the viewer's calendar day. */
export interface DaySummary {
  paidCount: number;
  /** Sum of the paid bills, discounts already taken off. */
  salesTotal: Kurus;
  /** Zero while nothing was paid, never NaN. */
  averageBill: Kurus;
  cancelledCount: number;
  /** What the cancelled bills would have come to. Not part of sales. */
  cancelledTotal: Kurus;
  /** Money settled per method, largest first; methods that took nothing are left out. */
  byMethod: readonly MethodSales[];
  /** Always 24 entries, one per hour of the day, so a chart can draw the whole day. */
  byHour: readonly HourlySales[];
  /** The busiest hour (the earliest on a tie), or null when nothing was sold. */
  peakHour: HourlySales | null;
}

export interface Occupancy {
  occupied: number;
  free: number;
  total: number;
  /** Whole percent; 0 when no table is defined. */
  percent: number;
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const sumTotals = (entries: readonly ClosedOrder[]): Kurus => entries.reduce((sum, entry) => sum + orderTotal(entry.order), 0);

function salesByMethod(paid: readonly ClosedOrder[]): MethodSales[] {
  const totals = paid
    .flatMap((entry) => entry.order.payments)
    .reduce<Partial<Record<PaymentMethod, Kurus>>>((sums, payment) => ({ ...sums, [payment.method]: (sums[payment.method] ?? 0) + payment.amount }), {});

  const settled = Object.values(totals).reduce((sum, amount) => sum + amount, 0);

  return PAYMENT_METHODS.map((method) => ({ method, amount: totals[method] ?? 0 }))
    .filter((entry) => entry.amount > 0)
    .map((entry) => ({ ...entry, share: Math.round((entry.amount / settled) * 100) }))
    .sort((a, b) => b.amount - a.amount);
}

function salesByHour(paid: readonly ClosedOrder[]): HourlySales[] {
  return Array.from({ length: HOURS_IN_DAY }, (_, hour) => ({
    hour,
    amount: sumTotals(paid.filter((entry) => new Date(entry.closedAt).getHours() === hour)),
  }));
}

/** Every bill (paid or cancelled) that left the floor on the viewer's calendar day. */
export const closedOrdersToday = (state: PosState, now: Date): readonly ClosedOrder[] =>
  state.history.filter((entry) => isSameDay(new Date(entry.closedAt), now));

export function summarizeDay(state: PosState, now: Date): DaySummary {
  const closedToday = closedOrdersToday(state, now);
  const paid = closedToday.filter((entry) => entry.outcome === "paid");
  const cancelled = closedToday.filter((entry) => entry.outcome === "cancelled");
  const byHour = salesByHour(paid);
  const salesTotal = sumTotals(paid);

  return {
    paidCount: paid.length,
    salesTotal,
    averageBill: paid.length === 0 ? 0 : Math.round(salesTotal / paid.length),
    cancelledCount: cancelled.length,
    cancelledTotal: sumTotals(cancelled),
    byMethod: salesByMethod(paid),
    byHour,
    peakHour: byHour.reduce<HourlySales | null>((peak, bucket) => (bucket.amount > (peak?.amount ?? 0) ? bucket : peak), null),
  };
}

/** How many of the defined tables have something on their bill right now. */
export function tableOccupancy(state: PosState): Occupancy {
  const total = state.tables.length;
  const occupied = state.tables.filter((table) => isTableOccupied(state, table.id)).length;
  return { occupied, free: total - occupied, total, percent: total === 0 ? 0 : Math.round((occupied / total) * 100) };
}

/** Open bills with something on them; a bill that was just opened and is still empty is not counted. */
export const openBillCount = (state: PosState): number => state.orders.filter((order) => order.lines.length > 0).length;

/** "09:00" for hour 9. */
export const hourLabel = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

export interface ProductSales {
  productId: string;
  name: string;
  /** How many units, complimentary ones included. */
  quantity: number;
  /** What they brought in; a complimentary line adds to `quantity` but never to `amount`. */
  amount: Kurus;
}

/** Units sold and revenue per product today, largest revenue first. Cancelled bills do not count as sales. */
export function productSalesToday(state: PosState, now: Date): readonly ProductSales[] {
  const paidToday = closedOrdersToday(state, now).filter((entry) => entry.outcome === "paid");
  const totals = new Map<string, ProductSales>();

  for (const entry of paidToday) {
    for (const line of entry.order.lines) {
      const current = totals.get(line.productId) ?? { productId: line.productId, name: line.name, quantity: 0, amount: 0 };
      totals.set(line.productId, { ...current, quantity: current.quantity + line.quantity, amount: current.amount + lineTotal(line) });
    }
  }

  return [...totals.values()].sort((a, b) => b.amount - a.amount);
}
