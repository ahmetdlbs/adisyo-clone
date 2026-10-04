"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { upsertById, removeById } from "@/lib/collection";
import type { Kurus } from "@/lib/money";
import type { Order, OrderType, PaymentMethod } from "../model/order";
import type { Area, Category, Product, TableDefinition } from "../model/pos-state";
import {
  addTablesAction,
  fetchAreas,
  fetchTables,
  deleteAreaAction,
  deleteTableAction,
  moveAreaAction,
  saveAreaAction,
  saveTableAction,
  type BulkTablesInput,
  type TableFormInput,
} from "../server/floor-plan-actions";
import { deleteCategoryAction, deleteProductAction, fetchCategories, fetchProducts, saveCategoryAction, saveProductAction } from "../server/menu-actions";
import type { ProductFormValues } from "../model/definition-forms";
import {
  addProductAction,
  applyPaymentAction,
  cancelOrderAction,
  closeOrderAction,
  decrementProductAction,
  discardEmptyOrderAction,
  fetchOpenOrders,
  dispatchDeliveryAction,
  markReadyAction,
  moveOrderToTableAction,
  openOrderAction,
  removeLineAction,
  resetOrderAction,
  setChargesAction,
  setGuestsAction,
  setDiscountAction,
  toggleComplimentaryAction,
} from "../server/order-actions";

/** Everything the live POS screens need: the floor plan, the menu, and every currently-open order. */
export interface PosSnapshot {
  areas: readonly Area[];
  tables: readonly TableDefinition[];
  categories: readonly Category[];
  products: readonly Product[];
  orders: readonly Order[];
}

interface PosContextValue {
  snapshot: PosSnapshot;
  setSnapshot: (updater: (prev: PosSnapshot) => PosSnapshot) => void;
}

const PosContext = createContext<PosContextValue | null>(null);

/** How often the open bills are re-read from the server, and how often the rest of the snapshot is. */
export const ORDERS_POLL_MS = 5_000;
const CATALOG_POLL_MS = 60_000;

/**
 * Holds the POS data for everything below it, seeded once from the server (see `(app)/layout.tsx`). The
 * database is the single source of truth; every mutation goes through `usePosActions()`, which calls the real
 * API and merges its response back into this snapshot.
 *
 * With `liveSync` the snapshot also follows other terminals: open bills are re-read every few seconds (and
 * when the tab regains focus), the floor plan and menu every minute. A re-read that was started before this
 * terminal's own latest change is dropped, so it can never roll that change back.
 */
export function PosProvider({ children, initial, liveSync = false }: { children: ReactNode; initial: PosSnapshot; liveSync?: boolean }) {
  const [snapshot, setSnapshotState] = useState(initial);
  const lastLocalChange = useRef(0);
  const setSnapshot = useCallback((updater: (prev: PosSnapshot) => PosSnapshot) => {
    lastLocalChange.current = Date.now();
    setSnapshotState(updater);
  }, []);

  useEffect(() => {
    if (!liveSync) return;
    let isActive = true;

    const refresh = async (everything: boolean) => {
      const startedAt = Date.now();
      try {
        const [orders, rest] = await Promise.all([
          fetchOpenOrders(),
          everything ? Promise.all([fetchAreas(), fetchTables(), fetchCategories(), fetchProducts()]) : Promise.resolve(null),
        ]);
        if (!isActive || lastLocalChange.current > startedAt) return;
        setSnapshotState((prev) => ({
          ...prev,
          orders,
          ...(rest ? { areas: rest[0], tables: rest[1], categories: rest[2], products: rest[3] } : {}),
        }));
      } catch {
        // A missed refresh is not an error: the next tick tries again, and every action reports its own failures.
      }
    };

    const ordersTimer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh(false);
    }, ORDERS_POLL_MS);
    const catalogTimer = setInterval(() => {
      if (document.visibilityState === "visible") void refresh(true);
    }, CATALOG_POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh(true);
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      isActive = false;
      clearInterval(ordersTimer);
      clearInterval(catalogTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [liveSync]);

  return <PosContext.Provider value={{ snapshot, setSnapshot }}>{children}</PosContext.Provider>;
}

function usePosContext(): PosContextValue {
  const ctx = useContext(PosContext);
  if (!ctx) throw new Error("usePosState / usePosActions must be used inside <PosProvider>");
  return ctx;
}

export function usePosState(): PosSnapshot {
  return usePosContext().snapshot;
}

const withOrder = (order: Order) => (prev: PosSnapshot) => ({ ...prev, orders: upsertById(prev.orders, order) });
const withoutOrder = (orderId: string) => (prev: PosSnapshot) => ({ ...prev, orders: removeById(prev.orders, orderId) });

export interface PosActions {
  // Orders
  openOrder(input: { type: OrderType; tableId: string | null; customerName?: string; waiter: string }): Promise<string>;
  addProduct(orderId: string, productId: string, portionId: string): Promise<void>;
  decrementProduct(orderId: string, productId: string, portionId: string): Promise<void>;
  removeLine(orderId: string, lineId: string): Promise<void>;
  toggleComplimentary(orderId: string, lineId: string): Promise<void>;
  resetOrder(orderId: string): Promise<void>;
  setDiscount(orderId: string, percent: number): Promise<void>;
  setCharges(orderId: string, charges: { kuver: boolean; garsoniye: boolean }): Promise<void>;
  setGuests(orderId: string, count: number): Promise<void>;
  applyPayment(
    orderId: string,
    request: { method: PaymentMethod; tendered: Kurus; lineIds?: readonly string[]; customerId?: string }
  ): Promise<{ change: Kurus; order: Order }>;
  closeOrder(orderId: string): Promise<void>;
  cancelOrder(orderId: string): Promise<void>;
  discardEmptyOrder(orderId: string): Promise<void>;
  moveOrderToTable(orderId: string, tableId: string): Promise<void>;
  markReady(orderId: string): Promise<void>;
  dispatchDelivery(orderId: string): Promise<void>;
  // Floor plan
  saveArea(id: string | null, name: string): Promise<void>;
  moveArea(id: string, offset: -1 | 1): Promise<void>;
  deleteArea(id: string): Promise<void>;
  saveTable(id: string | null, values: TableFormInput): Promise<void>;
  deleteTable(id: string): Promise<void>;
  addTables(values: BulkTablesInput): Promise<void>;
  // Menu
  saveCategory(id: string | null, name: string): Promise<void>;
  deleteCategory(id: string): Promise<void>;
  saveProduct(id: string | null, values: ProductFormValues): Promise<void>;
  deleteProduct(id: string): Promise<void>;
}

export function usePosActions(): PosActions {
  const { setSnapshot } = usePosContext();

  return useMemo<PosActions>(() => ({
    async openOrder(input) {
      const order = await openOrderAction(input);
      setSnapshot(withOrder(order));
      return order.id;
    },
    async addProduct(orderId, productId, portionId) {
      setSnapshot(withOrder(await addProductAction(orderId, productId, portionId)));
    },
    async decrementProduct(orderId, productId, portionId) {
      setSnapshot(withOrder(await decrementProductAction(orderId, productId, portionId)));
    },
    async removeLine(orderId, lineId) {
      setSnapshot(withOrder(await removeLineAction(orderId, lineId)));
    },
    async toggleComplimentary(orderId, lineId) {
      setSnapshot(withOrder(await toggleComplimentaryAction(orderId, lineId)));
    },
    async resetOrder(orderId) {
      setSnapshot(withOrder(await resetOrderAction(orderId)));
    },
    async setGuests(orderId, count) {
      setSnapshot(withOrder(await setGuestsAction(orderId, count)));
    },
    async setCharges(orderId, charges) {
      setSnapshot(withOrder(await setChargesAction(orderId, charges)));
    },
    async setDiscount(orderId, percent) {
      setSnapshot(withOrder(await setDiscountAction(orderId, percent)));
    },
    async applyPayment(orderId, request) {
      const result = await applyPaymentAction(orderId, request);
      setSnapshot(withOrder(result.order));
      return result;
    },
    async closeOrder(orderId) {
      const order = await closeOrderAction(orderId);
      setSnapshot(withoutOrder(order.id));
    },
    async cancelOrder(orderId) {
      const order = await cancelOrderAction(orderId);
      setSnapshot(withoutOrder(order.id));
    },
    async discardEmptyOrder(orderId) {
      await discardEmptyOrderAction(orderId);
      // The API only actually deletes an order with nothing on it — mirror that check here too, so a bill
      // that was left with items on it does not vanish from the floor just because "back" was pressed.
      setSnapshot((prev) => {
        const order = prev.orders.find((candidate) => candidate.id === orderId);
        return order && order.lines.length === 0 && order.payments.length === 0
          ? { ...prev, orders: removeById(prev.orders, orderId) }
          : prev;
      });
    },
    async moveOrderToTable(orderId, tableId) {
      setSnapshot(withOrder(await moveOrderToTableAction(orderId, tableId)));
    },
    async markReady(orderId) {
      setSnapshot(withOrder(await markReadyAction(orderId)));
    },
    async dispatchDelivery(orderId) {
      setSnapshot(withOrder(await dispatchDeliveryAction(orderId)));
    },
    async saveArea(id, name) {
      const area = await saveAreaAction(id, name);
      setSnapshot((prev) => ({ ...prev, areas: upsertById(prev.areas, area) }));
    },
    async moveArea(id, offset) {
      const areas = await moveAreaAction(id, offset);
      setSnapshot((prev) => ({ ...prev, areas }));
    },
    async deleteArea(id) {
      await deleteAreaAction(id);
      setSnapshot((prev) => ({
        ...prev,
        areas: removeById(prev.areas, id),
        tables: prev.tables.filter((table) => table.areaId !== id),
      }));
    },
    async saveTable(id, values) {
      const table = await saveTableAction(id, values);
      setSnapshot((prev) => ({ ...prev, tables: upsertById(prev.tables, table) }));
    },
    async deleteTable(id) {
      await deleteTableAction(id);
      setSnapshot((prev) => ({ ...prev, tables: removeById(prev.tables, id) }));
    },
    async addTables(values) {
      const tables = await addTablesAction(values);
      setSnapshot((prev) => ({ ...prev, tables: [...prev.tables, ...tables] }));
    },
    async saveCategory(id, name) {
      const category = await saveCategoryAction(id, name);
      setSnapshot((prev) => ({ ...prev, categories: upsertById(prev.categories, category) }));
    },
    async deleteCategory(id) {
      await deleteCategoryAction(id);
      setSnapshot((prev) => ({ ...prev, categories: removeById(prev.categories, id) }));
    },
    async saveProduct(id, values) {
      const product = await saveProductAction(id, values);
      setSnapshot((prev) => ({ ...prev, products: upsertById(prev.products, product) }));
    },
    async deleteProduct(id) {
      await deleteProductAction(id);
      setSnapshot((prev) => ({ ...prev, products: removeById(prev.products, id) }));
    },
  }), [setSnapshot]);
}
