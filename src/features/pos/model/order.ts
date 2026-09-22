import { percentOf, type Kurus } from "@/lib/money";

export const ORDER_TYPES = ["table", "takeaway", "delivery"] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

/** Where an order is in the kitchen/dispatch flow; the kanban columns follow it. */
export const ORDER_STAGES = ["preparing", "ready", "out_for_delivery"] as const;
export type OrderStage = (typeof ORDER_STAGES)[number];

export const PAYMENT_METHODS = ["cash", "card", "multinet", "smart_ticket", "setcard", "pluxee", "other", "on_account"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: "Nakit",
  card: "Kredi Kartı",
  multinet: "Multinet",
  smart_ticket: "Smart Ticket",
  setcard: "SetCard",
  pluxee: "Pluxee (Sodexo)",
  other: "Diğer",
  on_account: "Ödenmez",
};

export interface OrderLine {
  id: string;
  productId: string;
  name: string;
  /** Price when the line was added, so a later menu price change does not rewrite an open bill. */
  unitPrice: Kurus;
  quantity: number;
  /** İkram: served free of charge. */
  isComplimentary: boolean;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  amount: Kurus;
  paidAt: string;
  /** Lines this payment settled, when the customer paid by item. */
  lineIds: readonly string[];
}

export interface Order {
  id: string;
  /** Adisyon number shown on the bill. */
  number: number;
  type: OrderType;
  tableId: string | null;
  customerName?: string;
  waiter: string;
  openedAt: string;
  stage: OrderStage;
  lines: readonly OrderLine[];
  discountPercent: number;
  payments: readonly Payment[];
}

export const LATE_AFTER_MINUTES = 15;

const SETTLED_LINE_MESSAGE = "Ödenmiş kalem değiştirilemez";

// ── Amounts ─────────────────────────────────────────────────────────────────

export const lineTotal = (line: OrderLine): Kurus => (line.isComplimentary ? 0 : line.unitPrice * line.quantity);

export const subtotal = (order: Order): Kurus => order.lines.reduce((sum, line) => sum + lineTotal(line), 0);

export const discountAmount = (order: Order): Kurus => percentOf(subtotal(order), order.discountPercent);

export const orderTotal = (order: Order): Kurus => subtotal(order) - discountAmount(order);

export const paidTotal = (order: Order): Kurus => order.payments.reduce((sum, payment) => sum + payment.amount, 0);

export const remaining = (order: Order): Kurus => Math.max(0, orderTotal(order) - paidTotal(order));

/** An order can be closed once nothing is due: fully paid, or empty/complimentary. */
export const canClose = (order: Order): boolean => remaining(order) === 0;

export const isLineSettled = (order: Order, lineId: string): boolean =>
  order.payments.some((payment) => payment.lineIds.includes(lineId));

// ── Editing lines ───────────────────────────────────────────────────────────

function assertLineEditable(order: Order, lineId: string) {
  if (isLineSettled(order, lineId)) throw new Error(SETTLED_LINE_MESSAGE);
}

/** Adds one of a product: raises the quantity of its open line, or starts a new line. */
export function addProduct(order: Order, product: { id: string; name: string; price: Kurus }, newLineId: string): Order {
  const open = order.lines.find(
    (line) => line.productId === product.id && !line.isComplimentary && !isLineSettled(order, line.id)
  );

  if (open) {
    return { ...order, lines: order.lines.map((line) => (line.id === open.id ? { ...line, quantity: line.quantity + 1 } : line)) };
  }

  const line: OrderLine = {
    id: newLineId,
    productId: product.id,
    name: product.name,
    unitPrice: product.price,
    quantity: 1,
    isComplimentary: false,
  };
  return { ...order, lines: [...order.lines, line] };
}

/** Takes one of a product off; the line disappears at zero. A product not on the order is ignored. */
export function decrementProduct(order: Order, productId: string): Order {
  const candidates = order.lines.filter((line) => line.productId === productId && !line.isComplimentary);
  const editable = candidates.findLast((line) => !isLineSettled(order, line.id));

  if (!editable) {
    if (candidates.length > 0) throw new Error(SETTLED_LINE_MESSAGE);
    return order;
  }

  const lines =
    editable.quantity > 1
      ? order.lines.map((line) => (line.id === editable.id ? { ...line, quantity: line.quantity - 1 } : line))
      : order.lines.filter((line) => line.id !== editable.id);
  return { ...order, lines };
}

export function removeLine(order: Order, lineId: string): Order {
  assertLineEditable(order, lineId);
  return { ...order, lines: order.lines.filter((line) => line.id !== lineId) };
}

export function toggleComplimentary(order: Order, lineId: string): Order {
  assertLineEditable(order, lineId);
  return {
    ...order,
    lines: order.lines.map((line) => (line.id === lineId ? { ...line, isComplimentary: !line.isComplimentary } : line)),
  };
}

/** How many of a product are on the bill (complimentary portions are counted separately, so not here). */
export const quantityOf = (order: Order, productId: string): number =>
  order.lines.filter((line) => line.productId === productId && !line.isComplimentary).reduce((sum, line) => sum + line.quantity, 0);

/** Clears the bill. Lines that were already paid for stay, and so do the payments and the discount. */
export const resetOrder = (order: Order): Order => ({ ...order, lines: order.lines.filter((line) => isLineSettled(order, line.id)) });

/** Sets the order-wide discount. Rejects anything outside 0–100, or a discount that would undercut what was already paid. */
export function setDiscountPercent(order: Order, percent: number): Order {
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new RangeError("İndirim yüzdesi 0 ile 100 arasında olmalıdır");
  }
  const next = { ...order, discountPercent: percent };
  if (paidTotal(next) > orderTotal(next)) {
    throw new RangeError("İndirim, tahsil edilen tutarın altına düşemez");
  }
  return next;
}

// ── Payments ────────────────────────────────────────────────────────────────

export interface PaymentRequest {
  method: PaymentMethod;
  /** What the customer handed over, in kuruş. */
  tendered: Kurus;
  lineIds?: readonly string[];
}

/**
 * Records a payment. Only cash may exceed the amount due (the rest comes back as change); every other method
 * must not overpay. The stored payment is what was due, never the handed-over amount.
 */
export function applyPayment(
  order: Order,
  { method, tendered, lineIds = [] }: PaymentRequest,
  context: { paymentId: string; now: Date }
): { order: Order; change: Kurus } {
  if (!Number.isInteger(tendered) || tendered <= 0) {
    throw new RangeError("Tutar sıfırdan büyük ve kuruş cinsinden tam sayı olmalıdır");
  }
  const due = remaining(order);
  if (due === 0) throw new Error("Ödenecek tutar yok");
  if (tendered > due && method !== "cash") throw new RangeError("Tutar kalan tutarı aşamaz");

  const amount = Math.min(tendered, due);
  const payment: Payment = { id: context.paymentId, method, amount, paidAt: context.now.toISOString(), lineIds };
  return { order: { ...order, payments: [...order.payments, payment] }, change: tendered - amount };
}

/** What paying these lines costs: their totals with the order discount, minus paid/free lines, capped at what is due. */
export function selectionAmount(order: Order, lineIds: readonly string[]): Kurus {
  const gross = order.lines
    .filter((line) => lineIds.includes(line.id) && !isLineSettled(order, line.id))
    .reduce((sum, line) => sum + lineTotal(line) - percentOf(lineTotal(line), order.discountPercent), 0);
  return Math.min(gross, remaining(order));
}

// ── Kitchen flow ────────────────────────────────────────────────────────────

export function markReady(order: Order): Order {
  if (order.stage !== "preparing") throw new Error("Sipariş hazırlanıyor durumunda değil");
  return { ...order, stage: "ready" };
}

export function dispatchDelivery(order: Order): Order {
  if (order.type !== "delivery") throw new Error("Yalnızca paket sipariş teslimata çıkabilir");
  if (order.stage !== "ready") throw new Error("Sipariş hazır değil");
  return { ...order, stage: "out_for_delivery" };
}

const minutesSince = (isoTime: string, now: Date) => Math.max(0, Math.floor((now.getTime() - new Date(isoTime).getTime()) / 60_000));

export const isLate = (order: Order, now: Date): boolean =>
  order.stage === "preparing" && minutesSince(order.openedAt, now) > LATE_AFTER_MINUTES;

/** "45 dk" or "4 s 20 dk". */
export function elapsedLabel(openedAt: string, now: Date): string {
  const minutes = minutesSince(openedAt, now);
  return minutes < 60 ? `${minutes} dk` : `${Math.floor(minutes / 60)} s ${String(minutes % 60).padStart(2, "0")} dk`;
}
