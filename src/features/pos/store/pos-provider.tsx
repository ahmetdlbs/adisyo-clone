"use client";

import { createContext, useContext, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { createSeedState } from "../data/pos-seed";
import type { Order } from "../model/order";
import {
  cancelOrder,
  closeOrder,
  createOrder,
  discardEmptyOrder,
  moveOrderToTable,
  updateOrder,
  type NewOrder,
  type PosState,
} from "../model/pos-state";
import { createPersistedStore, type StorageLike, type Store } from "./persisted-store";
import { parsePosState } from "./pos-schema";

// v3: renamed for the Adisyon Merkezi rebrand; the key change also drops any pre-rebrand browser state.
const STORAGE_KEY = "adisyon-merkezi.pos.v3";

export function createPosStore(options: { initial?: PosState; storage?: StorageLike | null } = {}): Store<PosState> {
  return createPersistedStore({
    key: STORAGE_KEY,
    initial: options.initial ?? createSeedState(new Date()),
    parse: parsePosState,
    storage: options.storage,
  });
}

export interface PosActions {
  /** Opens an order and returns its id. Throws when the table is taken or unknown. */
  openOrder(input: Omit<NewOrder, "id" | "now">): string;
  updateOrder(orderId: string, updater: (order: Order) => Order): void;
  closeOrder(orderId: string): void;
  cancelOrder(orderId: string): void;
  discardEmptyOrder(orderId: string): void;
  moveOrderToTable(orderId: string, tableId: string): void;
  /** Applies any pure state change, e.g. a menu or floor-plan edit. Whatever the change throws reaches the caller. */
  change(update: (state: PosState) => PosState): void;
}

function createPosActions(store: Store<PosState>): PosActions {
  return {
    openOrder(input) {
      const id = crypto.randomUUID();
      store.setState((state) => createOrder(state, { ...input, id, now: new Date() }));
      return id;
    },
    updateOrder: (orderId, updater) => store.setState((state) => updateOrder(state, orderId, updater)),
    closeOrder: (orderId) => store.setState((state) => closeOrder(state, orderId, new Date())),
    cancelOrder: (orderId) => store.setState((state) => cancelOrder(state, orderId, new Date())),
    discardEmptyOrder: (orderId) => store.setState((state) => discardEmptyOrder(state, orderId)),
    moveOrderToTable: (orderId, tableId) => store.setState((state) => moveOrderToTable(state, orderId, tableId)),
    change: (update) => store.setState(update),
  };
}

const StoreContext = createContext<Store<PosState> | null>(null);

/** Holds the POS data for everything below it. Pass `store` in tests; the app creates a persisted one. */
export function PosProvider({ children, store }: { children: ReactNode; store?: Store<PosState> }) {
  const [current] = useState(() => store ?? createPosStore());
  return <StoreContext.Provider value={current}>{children}</StoreContext.Provider>;
}

function usePosStore(): Store<PosState> {
  const store = useContext(StoreContext);
  if (!store) throw new Error("usePosState / usePosActions must be used inside <PosProvider>");
  return store;
}

export function usePosState(): PosState {
  const store = usePosStore();
  return useSyncExternalStore(store.subscribe, store.getState, store.getServerState);
}

export function usePosActions(): PosActions {
  const store = usePosStore();
  return useMemo(() => createPosActions(store), [store]);
}
