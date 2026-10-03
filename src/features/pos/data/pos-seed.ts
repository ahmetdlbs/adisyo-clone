import { toKurus } from "@/lib/money";
import { orderTotal, type Order, type OrderLine, type PaymentMethod } from "../model/order";
import type { Category, ClosedOrder, PosState, Product, TableDefinition } from "../model/pos-state";

const CATEGORIES: readonly Category[] = [
  { id: "c-icecekler", name: "İçecekler" },
  { id: "c-milkshake", name: "Milkshake" },
  { id: "c-tatli", name: "Tatlı ve Pastalar" },
  { id: "c-yiyecekler", name: "Yiyecekler" },
];

/** [id, name, category, price in lira, favourite] */
const MENU: readonly (readonly [string, string, string, number, boolean?])[] = [
  ["p-cay", "Çay", "c-icecekler", 52, true],
  ["p-salep", "Salep", "c-icecekler", 140],
  ["p-bitki-cayi", "Bitki Çayı", "c-icecekler", 122],
  ["p-turk-kahvesi", "Türk Kahvesi", "c-icecekler", 105],
  ["p-filtre-kahve", "Filtre Kahve", "c-icecekler", 105],
  ["p-su", "Su", "c-icecekler", 45],
  ["p-ayran", "Ayran", "c-icecekler", 70],
  ["p-kola", "Coca Cola", "c-icecekler", 105],
  ["p-soda", "Soda", "c-icecekler", 52],
  ["p-icetea", "Ice Tea", "c-icecekler", 87],
  ["p-mocha-frappe", "Mocha Frappe", "c-icecekler", 175],
  ["p-dondurmali-frappe", "Dondurmalı Frappe", "c-icecekler", 192],
  ["p-ms-cilek", "Çilekli Milkshake", "c-milkshake", 160],
  ["p-ms-cikolata", "Çikolatalı Milkshake", "c-milkshake", 160],
  ["p-ms-vanilya", "Vanilyalı Milkshake", "c-milkshake", 150],
  ["p-ms-muz", "Muzlu Milkshake", "c-milkshake", 160],
  ["p-ms-karamel", "Karamelli Milkshake", "c-milkshake", 165],
  ["p-san-seb", "San Sebastian Cheesecake", "c-tatli", 195],
  ["p-sufle", "Sıcak Çikolatalı Sufle", "c-tatli", 175],
  ["p-tiramisu", "İtalyan Tiramisu", "c-tatli", 165],
  ["p-profiterol", "Profiterol", "c-tatli", 155],
  ["p-waffle", "Meyveli Waffle", "c-tatli", 210],
  ["p-karisik-pizza", "Karışık Pizza (Orta)", "c-yiyecekler", 290],
  ["p-margarita", "Margherita Pizza", "c-yiyecekler", 245],
  ["p-burger", "Adisyon Cheeseburger Menü", "c-yiyecekler", 265],
  ["p-tavuk-salata", "Izgara Tavuklu Salata", "c-yiyecekler", 210],
  ["p-tost", "Kaşarlı Karışık Tost", "c-yiyecekler", 135],
  ["p-makarna", "Penne Arabbiata", "c-yiyecekler", 225],
];

const PRODUCTS: readonly Product[] = MENU.map(([id, name, categoryId, lira, isFavorite]) => ({
  id,
  name,
  categoryId,
  price: toKurus(lira),
  isFavorite: isFavorite ?? false,
}));

const TABLES: readonly TableDefinition[] = [
  ...Array.from({ length: 10 }, (_, index): TableDefinition => ({
    id: `t-${index + 1}`,
    name: `Masa ${index + 1}`,
    areaId: "a-salon",
    shape: "square",
  })),
  ...Array.from({ length: 5 }, (_, index): TableDefinition => ({
    id: `t-b2-${index + 1}`,
    name: `Bahçe ${index + 1}`,
    areaId: "a-bolge2",
    shape: "square",
  })),
];

const minutesAgo = (now: Date, minutes: number) => new Date(now.getTime() - minutes * 60_000).toISOString();
const todayAt = (now: Date, hour: number, minute = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);

function line(id: string, productId: string, quantity = 1): OrderLine {
  const product = PRODUCTS.find((candidate) => candidate.id === productId);
  if (!product) throw new Error(`Seed refers to an unknown product: ${productId}`);
  return { id, productId, name: product.name, unitPrice: product.price, quantity, isComplimentary: false };
}

interface HistoryEntryInput {
  id: string;
  number: number;
  hour: number;
  minute?: number;
  waiter: string;
  tableId: string | null;
  type?: Order["type"];
  lines: readonly OrderLine[];
  method: PaymentMethod;
  discountPercent?: number;
  outcome?: ClosedOrder["outcome"];
}

/** A bill closed at a fixed hour of "today", paid (or cancelled) for its full total. */
function historyEntry(now: Date, input: HistoryEntryInput): ClosedOrder {
  const closedAt = todayAt(now, input.hour, input.minute ?? 0);
  const openedAt = new Date(closedAt.getTime() - 25 * 60_000);
  const order: Order = {
    id: input.id,
    number: input.number,
    type: input.type ?? (input.tableId ? "table" : "takeaway"),
    tableId: input.tableId,
    waiter: input.waiter,
    openedAt: openedAt.toISOString(),
    stage: "preparing",
    lines: input.lines,
    discountPercent: input.discountPercent ?? 0,
    payments: [],
  };
  const outcome = input.outcome ?? "paid";
  const due = orderTotal(order);
  return {
    order: outcome === "paid" ? { ...order, payments: [{ id: `pay-${input.id}`, method: input.method, amount: due, paidAt: closedAt.toISOString(), lineIds: [] }] } : order,
    outcome,
    closedAt: closedAt.toISOString(),
  };
}

/** Today's business so far: enough closed bills, spread across the day and across payment methods, for the
 * dashboard and reports to show a real (not empty, not fabricated-looking) picture as soon as the app opens. */
function buildTodayHistory(now: Date): readonly ClosedOrder[] {
  return [
    historyEntry(now, { id: "h-1", number: 101, hour: 9, minute: 20, waiter: "ahmet", tableId: "t-3", method: "cash", lines: [line("h-1-a", "p-cay", 2), line("h-1-b", "p-tost")] }),
    historyEntry(now, { id: "h-2", number: 102, hour: 10, minute: 5, waiter: "ahmet", tableId: null, type: "takeaway", method: "card", lines: [line("h-2-a", "p-filtre-kahve"), line("h-2-b", "p-profiterol")] }),
    historyEntry(now, { id: "h-3", number: 103, hour: 11, minute: 40, waiter: "zeynep", tableId: "t-5", method: "card", lines: [line("h-3-a", "p-burger"), line("h-3-b", "p-kola"), line("h-3-c", "p-ayran")] }),
    historyEntry(now, { id: "h-4", number: 104, hour: 12, minute: 15, waiter: "zeynep", tableId: "t-2", method: "multinet", lines: [line("h-4-a", "p-karisik-pizza"), line("h-4-b", "p-icetea", 2)] }),
    historyEntry(now, { id: "h-5", number: 105, hour: 13, minute: 0, waiter: "ahmet", tableId: "t-8", method: "cash", lines: [line("h-5-a", "p-tavuk-salata"), line("h-5-b", "p-su", 2)] }),
    historyEntry(now, { id: "h-6", number: 106, hour: 13, minute: 45, waiter: "zeynep", tableId: null, type: "delivery", method: "on_account", lines: [line("h-6-a", "p-margarita"), line("h-6-b", "p-mocha-frappe")] }),
    historyEntry(now, { id: "h-7", number: 107, hour: 14, minute: 30, waiter: "ahmet", tableId: "t-1", method: "card", lines: [line("h-7-a", "p-makarna"), line("h-7-b", "p-turk-kahvesi", 2)], discountPercent: 10 }),
    historyEntry(now, { id: "h-8", number: 108, hour: 15, minute: 10, waiter: "zeynep", tableId: "t-b2-2", method: "cash", lines: [line("h-8-a", "p-waffle"), line("h-8-b", "p-ms-cilek")] }),
    historyEntry(now, { id: "h-9", number: 109, hour: 16, minute: 0, waiter: "ahmet", tableId: "t-4", method: "card", lines: [line("h-9-a", "p-san-seb"), line("h-9-b", "p-sufle"), line("h-9-c", "p-tiramisu")] }),
    historyEntry(now, { id: "h-10", number: 110, hour: 16, minute: 50, waiter: "zeynep", tableId: null, type: "takeaway", method: "smart_ticket", lines: [line("h-10-a", "p-ms-muz"), line("h-10-b", "p-ms-karamel")] }),
    historyEntry(now, { id: "h-11", number: 111, hour: 17, minute: 20, waiter: "ahmet", tableId: "t-6", method: "cash", lines: [line("h-11-a", "p-burger", 2), line("h-11-b", "p-kola", 2)] }),
    historyEntry(now, { id: "h-12", number: 112, hour: 18, minute: 5, waiter: "zeynep", tableId: "t-9", method: "card", lines: [line("h-12-a", "p-margarita"), line("h-12-b", "p-soda")] }),
    historyEntry(now, { id: "h-13", number: 113, hour: 12, minute: 50, waiter: "ahmet", tableId: "t-7", method: "cash", lines: [line("h-13-a", "p-tost")], outcome: "cancelled" }),
  ];
}

/** A demo restaurant: a floor plan, a menu, today's trading so far, and two open orders (a table and a takeaway). */
export function createSeedState(now: Date): PosState {
  const tableOrder: Order = {
    id: "o-seed-1",
    number: 201,
    type: "table",
    tableId: "t-1",
    customerName: "Ahmet Can",
    waiter: "ahmet",
    openedAt: minutesAgo(now, 260),
    stage: "preparing",
    lines: [line("l-1", "p-cay", 2), line("l-2", "p-kola"), line("l-3", "p-salep"), line("l-4", "p-ayran")],
    discountPercent: 0,
    payments: [],
  };

  const takeawayOrder: Order = {
    id: "o-seed-2",
    number: 202,
    type: "takeaway",
    tableId: null,
    customerName: "Ahmet",
    waiter: "ahmet",
    openedAt: minutesAgo(now, 5),
    stage: "preparing",
    lines: [line("l-5", "p-su")],
    discountPercent: 0,
    payments: [],
  };

  return {
    areas: [
      { id: "a-salon", name: "Salon" },
      { id: "a-bolge2", name: "bölge 2" },
    ],
    tables: TABLES,
    categories: CATEGORIES,
    products: PRODUCTS,
    orders: [tableOrder, takeawayOrder],
    history: buildTodayHistory(now),
    nextOrderNumber: 203,
  };
}
