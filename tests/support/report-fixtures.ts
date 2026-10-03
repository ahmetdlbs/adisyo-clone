import type { Order } from "@/features/pos/model/order";

let sequence = 0;

/** A bill that already left the floor, the shape api/'s /reports/closed-orders returns. Paid unless told otherwise. */
export function closedOrder(overrides: Partial<Order> = {}): Order {
  sequence += 1;
  return {
    id: `closed-${sequence}`,
    number: sequence,
    type: "table",
    tableId: "t1",
    waiter: "ahmet",
    openedAt: new Date(2026, 8, 21, 14).toISOString(),
    stage: "preparing",
    status: "paid",
    closedAt: new Date(2026, 8, 21, 15).toISOString(),
    lines: [],
    discountPercent: 0,
    payments: [],
    ...overrides,
  };
}
