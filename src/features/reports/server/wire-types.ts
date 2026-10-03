import type { ApiOrder } from "@/features/pos/server/wire-types";

/**
 * Wire shapes returned by api/'s /reports endpoints (src/reports/report-calc.ts). Enum-like fields come back
 * UPPERCASE (Prisma convention); `adapt.ts` lower-cases them to match the existing lowercase domain types.
 */

export interface ApiHourlySales {
  hour: number;
  amount: number;
}

export interface ApiMethodSales {
  method: string;
  amount: number;
  share: number;
}

export interface ApiDaySummary {
  paidCount: number;
  salesTotal: number;
  averageBill: number;
  cancelledCount: number;
  cancelledTotal: number;
  byMethod: ApiMethodSales[];
  byHour: ApiHourlySales[];
  peakHour: ApiHourlySales | null;
  expenseTotal: number;
  wastageTotal: number;
  costOfGoods: number;
  stockValue: number;
}

export interface ApiProductSales {
  productId: string | null;
  name: string;
  quantity: number;
  amount: number;
}

/** GET /reports/closed-orders returns full orders (with lines/payments), same wire shape as /orders. */
export type ApiClosedOrder = ApiOrder;
