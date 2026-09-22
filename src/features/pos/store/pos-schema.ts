import { z } from "zod";
import { ORDER_STAGES, ORDER_TYPES, PAYMENT_METHODS } from "../model/order";
import type { PosState } from "../model/pos-state";

/** Storage is external input: a bad or outdated payload must never reach the app as state. */
const kurus = z.number().int();

const orderLineSchema = z.object({
  id: z.string(),
  productId: z.string(),
  name: z.string(),
  unitPrice: kurus.nonnegative(),
  quantity: z.number().int().positive(),
  isComplimentary: z.boolean(),
});

const paymentSchema = z.object({
  id: z.string(),
  method: z.enum(PAYMENT_METHODS),
  amount: kurus.positive(),
  paidAt: z.string(),
  lineIds: z.array(z.string()),
});

const orderSchema = z.object({
  id: z.string(),
  number: z.number().int().positive(),
  type: z.enum(ORDER_TYPES),
  tableId: z.string().nullable(),
  customerName: z.string().optional(),
  waiter: z.string(),
  openedAt: z.string(),
  stage: z.enum(ORDER_STAGES),
  lines: z.array(orderLineSchema),
  discountPercent: z.number().min(0).max(100),
  payments: z.array(paymentSchema),
});

const posStateSchema = z.object({
  areas: z.array(z.object({ id: z.string(), name: z.string() })),
  tables: z.array(
    z.object({ id: z.string(), name: z.string(), areaId: z.string(), shape: z.enum(["square", "circle"]) })
  ),
  categories: z.array(z.object({ id: z.string(), name: z.string() })),
  products: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      categoryId: z.string(),
      price: kurus.positive(),
      barcode: z.string().optional(),
      isFavorite: z.boolean(),
    })
  ),
  orders: z.array(orderSchema),
  history: z.array(z.object({ order: orderSchema, outcome: z.enum(["paid", "cancelled"]), closedAt: z.string() })),
  nextOrderNumber: z.number().int().positive(),
});

/** Returns the state when `raw` has exactly the expected shape, otherwise null. */
export function parsePosState(raw: unknown): PosState | null {
  const result = posStateSchema.safeParse(raw);
  return result.success ? result.data : null;
}
