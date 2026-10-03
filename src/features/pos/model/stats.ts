import type { Kurus } from "@/lib/money";
import type { PaymentMethod } from "./order";
import { isTableOccupied, type FloorAndOrders } from "./pos-state";

export interface Occupancy {
  occupied: number;
  free: number;
  total: number;
  /** Whole percent; 0 when no table is defined. */
  percent: number;
}

/** How many of the defined tables have something on their bill right now. Computed from the live snapshot. */
export function tableOccupancy(state: FloorAndOrders): Occupancy {
  const total = state.tables.length;
  const occupied = state.tables.filter((table) => isTableOccupied(state, table.id)).length;
  return { occupied, free: total - occupied, total, percent: total === 0 ? 0 : Math.round((occupied / total) * 100) };
}

/** Open bills with something on them; a bill that was just opened and is still empty is not counted. */
export const openBillCount = (state: Pick<FloorAndOrders, "orders">): number =>
  state.orders.filter((order) => order.lines.length > 0).length;

/** "09:00" for hour 9. */
export const hourLabel = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

// The shapes below mirror api/'s /reports responses (src/reports/report-calc.ts) — the aggregation itself
// now runs server-side, over every closed order in the database, not just what a browser tab has seen.

export interface HourlySales {
  hour: number;
  amount: Kurus;
}

export interface MethodSales {
  method: PaymentMethod;
  amount: Kurus;
  /** Whole percent of everything settled that day. */
  share: number;
}

/** What the dashboard shows about today: bills that left the floor on the calendar day the report covers. */
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
  /** Recorded expenses of the business day. */
  expenseTotal: Kurus;
  /** Cost of the day's fire (zayi). */
  wastageTotal: Kurus;
  /** What the portions sold cost to make (their Maliyet Tutarı × units). */
  costOfGoods: Kurus;
  /** What the stock on hand is worth (quantity × unit cost). */
  stockValue: Kurus;
}

export interface ProductSales {
  productId: string | null;
  name: string;
  /** How many units, complimentary ones included. */
  quantity: number;
  /** What they brought in; a complimentary line adds to `quantity` but never to `amount`. */
  amount: Kurus;
}
