import type { Order, OrderLine, Payment, PaymentMethod } from "@/features/pos/model/order";
import type { Product } from "@/features/pos/model/pos-state";
import type { DaySummary, HourlySales } from "@/features/pos/model/stats";
import type { PosSnapshot } from "@/features/pos/store/pos-provider";

export const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

/**
 * A small restaurant for screen tests. Masa 1 has an open bill: 2 × Çay (52,00) + 1 × Coca Cola (105,00) = 209,00.
 * Salon has Masa 1 and Masa 2; "bölge 2" has Bahçe 1.
 */
export function buildPosSnapshot(): PosSnapshot {
  const bill: Order = {
    id: "o1",
    number: 1,
    type: "table",
    tableId: "t1",
    customerName: "Ahmet Can",
    waiter: "Ahmet",
    openedAt: minutesAgo(260),
    stage: "preparing",
    status: "open",
    closedAt: null,
    lines: [
      { id: "l1", productId: "p-cay", portionId: "po-cay", name: "Çay", unitPrice: 5200, quantity: 2, isComplimentary: false },
      { id: "l2", productId: "p-kola", portionId: "po-kola", name: "Coca Cola", unitPrice: 10500, quantity: 1, isComplimentary: false },
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
      productFixture("p-cay", "Çay", "c1", 5200, true),
      productFixture("p-kola", "Coca Cola", "c1", 10500, false),
      productFixture("p-cheese", "Cheesecake", "c2", 19500, false),
    ],
    orders: [bill],
  };
}

/** One product with a single default "Tam" portion priced the same across every order channel. */
export function productFixture(id: string, name: string, categoryId: string, price: number, isFavorite = false): Product {
  return {
    id,
    name,
    categoryId,
    isFavorite,
    showOnSalesScreen: true,
    showOnKitchenScreen: true,
    vatExcluded: false,
    autoAskFeaturePortion: false,
    useRecipe: false,
    trackStock: false,
    isCombo: false,
    portions: [
      {
        id: `po-${id.replace(/^p-/, "")}`,
        name: "Tam",
        isDefault: true,
        tablePrice: price,
        takeawayPrice: price,
        deliveryPrice: price,
        recipeLines: [],
      },
    ],
    featureGroupIds: [],
    comboItems: [],
  };
}

/** A local-time moment on a September 2026 day. Local parts, like the code under test reads, so suites pass in any time zone. */
export const localTime = (hour: number, minute = 0, day = 21) => new Date(2026, 8, day, hour, minute);

export const billLine = (id: string, unitPrice: number, quantity = 1): OrderLine => ({
  id,
  productId: `p-${id}`,
  portionId: `po-${id}`,
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

const EMPTY_HOURS: readonly HourlySales[] = Array.from({ length: 24 }, (_, hour) => ({ hour, amount: 0 }));

/** What api/'s /reports/day-summary returns on a day nothing was sold, unless overridden. */
export function buildDaySummary(overrides: Partial<DaySummary> = {}): DaySummary {
  return {
    paidCount: 0,
    salesTotal: 0,
    averageBill: 0,
    cancelledCount: 0,
    cancelledTotal: 0,
    byMethod: [],
    byHour: EMPTY_HOURS,
    peakHour: null,
    expenseTotal: 0,
    wastageTotal: 0,
    costOfGoods: 0,
    stockValue: 0,
    ...overrides,
  };
}
