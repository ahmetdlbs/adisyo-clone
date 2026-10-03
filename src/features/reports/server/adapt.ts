import { lower } from "@/features/pos/server/adapt";
import type { PaymentMethod } from "@/features/pos/model/order";
import type { DaySummary, HourlySales, MethodSales, ProductSales } from "../../pos/model/stats";
import type { ApiDaySummary, ApiHourlySales, ApiMethodSales, ApiProductSales } from "./wire-types";

const toHourlySales = (hour: ApiHourlySales): HourlySales => ({ hour: hour.hour, amount: hour.amount });

const toMethodSales = (method: ApiMethodSales): MethodSales => ({
  method: lower<PaymentMethod>(method.method),
  amount: method.amount,
  share: method.share,
});

export const toDaySummary = (summary: ApiDaySummary): DaySummary => ({
  paidCount: summary.paidCount,
  salesTotal: summary.salesTotal,
  averageBill: summary.averageBill,
  cancelledCount: summary.cancelledCount,
  cancelledTotal: summary.cancelledTotal,
  byMethod: summary.byMethod.map(toMethodSales),
  byHour: summary.byHour.map(toHourlySales),
  peakHour: summary.peakHour ? toHourlySales(summary.peakHour) : null,
  expenseTotal: summary.expenseTotal,
  wastageTotal: summary.wastageTotal,
  costOfGoods: summary.costOfGoods,
  stockValue: summary.stockValue,
});

export const toProductSales = (product: ApiProductSales): ProductSales => ({
  productId: product.productId,
  name: product.name,
  quantity: product.quantity,
  amount: product.amount,
});
