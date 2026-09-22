import type { Order, OrderLine, Payment, PaymentMethod } from "@/features/pos/model/order";
import type { ClosedOrder, PosState } from "@/features/pos/model/pos-state";

export const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * A small restaurant for screen tests. Masa 1 has an open bill: 2 × Çay (52,00) + 1 × Coca Cola (105,00) = 209,00.
 * Salon has Masa 1 and Masa 2; "bölge 2" has Bahçe 1.
 */
export function buildPosState(): PosState {
  const bill: Order = {
    id: "o1",
    number: 1,
    type: "table",
    tableId: "t1",
    customerName: "Ahmet Can",
    waiter: "Ahmet",
    openedAt: minutesAgo(260),
    stage: "preparing",
    lines: [
      { id: "l1", productId: "p-cay", name: "Çay", unitPrice: 5200, quantity: 2, isComplimentary: false },
      { id: "l2", productId: "p-kola", name: "Coca Cola", unitPrice: 10500, quantity: 1, isComplimentary: false },
    ],
    discountPercent: 0,
    payments: [],
  };

  return {
    areas: [
      { id: "a1", name: "Salon" },
      { id: "a2", name: "bölge 2" },
    ],
    tables: [
      { id: "t1", name: "Masa 1", areaId: "a1", shape: "square" },
      { id: "t2", name: "Masa 2", areaId: "a1", shape: "square" },
      { id: "t3", name: "Bahçe 1", areaId: "a2", shape: "square" },
    ],
    categories: [
      { id: "c1", name: "İçecekler" },
      { id: "c2", name: "Tatlılar" },
    ],
    products: [
      { id: "p-cay", name: "Çay", categoryId: "c1", price: 5200, isFavorite: true },
      { id: "p-kola", name: "Coca Cola", categoryId: "c1", price: 10500, isFavorite: false },
      { id: "p-cheese", name: "Cheesecake", categoryId: "c2", price: 19500, isFavorite: false },
    ],
    orders: [bill],
    history: [],
    nextOrderNumber: 2,
  };
}

/** A local-time moment on a September 2026 day. Local parts, like the code under test reads, so suites pass in any time zone. */
export const localTime = (hour: number, minute = 0, day = 21) => new Date(2026, 8, day, hour, minute);

export const billLine = (id: string, unitPrice: number, quantity = 1): OrderLine => ({
  id,
  productId: `p-${id}`,
  name: id,
  unitPrice,
  quantity,
  isComplimentary: false,
});

export const billPayment = (method: PaymentMethod, amount: number, paidAt: Date): Payment => ({
  id: `pay-${method}-${amount}`,
  method,
  amount,
  paidAt: paidAt.toISOString(),
  lineIds: [],
});

interface ClosedOrderOptions {
  id?: string;
  closedAt: Date;
  lines?: OrderLine[];
  discountPercent?: number;
  /** Defaults to one cash payment for exactly the total. */
  payments?: Payment[];
  outcome?: ClosedOrder["outcome"];
}

/** A bill that left the floor: paid in cash for its whole total unless told otherwise. */
export function buildClosedOrder({
  id = "o",
  closedAt,
  lines = [billLine("a", 10000)],
  discountPercent = 0,
  payments,
  outcome = "paid",
}: ClosedOrderOptions): ClosedOrder {
  const total = Math.round(lines.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * (1 - discountPercent / 100));
  const order: Order = {
    id,
    number: 1,
    type: "table",
    tableId: "t1",
    waiter: "ahmet",
    openedAt: closedAt.toISOString(),
    stage: "preparing",
    lines,
    discountPercent,
    payments: payments ?? [billPayment("cash", total, closedAt)],
  };
  return { order, outcome, closedAt: closedAt.toISOString() };
}
