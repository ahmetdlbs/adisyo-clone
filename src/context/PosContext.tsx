"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  INITIAL_TABLES,
  INITIAL_PRODUCTS,
  INITIAL_KANBAN_ORDERS,
  TableData,
  ProductItem,
  OrderItem,
  KanbanOrder,
} from "@/data/posData";

type OrderType = "table" | "gel-al" | "paket";

interface PosContextType {
  tables: TableData[];
  setTables: React.Dispatch<React.SetStateAction<TableData[]>>;
  products: ProductItem[];
  kanbanOrders: KanbanOrder[];
  activeTableId: string | null;
  setActiveTableId: (id: string | null) => void;
  activeOrderType: OrderType;
  setActiveOrderType: (type: OrderType) => void;
  takeawayOrderStub: TableData | null;
  setTakeawayOrderStub: (stub: TableData | null) => void;

  handleUpdateTableItems: (tableId: string, items: OrderItem[]) => void;
  handleCompletePayment: (
    tableId: string,
    paidAmount: number,
    paymentType: string,
    isFullPayment: boolean
  ) => void;
  totalOpenOrders: number;
}

const PosContext = createContext<PosContextType | undefined>(undefined);

export function PosProvider({ children }: { children: ReactNode }) {
  const [tables, setTables] = useState<TableData[]>(INITIAL_TABLES);
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [kanbanOrders, setKanbanOrders] = useState<KanbanOrder[]>(
    INITIAL_KANBAN_ORDERS
  );

  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [activeOrderType, setActiveOrderType] = useState<OrderType>("table");
  const [takeawayOrderStub, setTakeawayOrderStub] = useState<TableData | null>(
    null
  );

  const totalOpenOrders = tables.reduce((acc, t) => {
    if (t.status === "occupied") {
      return (
        acc +
        t.items.reduce(
          (sum, it) => sum + (it.isComplimentary ? 0 : it.price * it.quantity),
          0
        )
      );
    }
    return acc;
  }, 0);

  const handleUpdateTableItems = (tableId: string, items: OrderItem[]) => {
    if (activeOrderType !== "table" && takeawayOrderStub) {
      setTakeawayOrderStub({
        ...takeawayOrderStub,
        items,
      });
      return;
    }

    setTables((prev) =>
      prev.map((t) => {
        if (t.id === tableId) {
          const isOccupied = items.length > 0;
          return {
            ...t,
            items,
            status: isOccupied ? "occupied" : "empty",
            customerName: isOccupied ? t.customerName || "Misafir" : undefined,
            waiter: isOccupied ? t.waiter || "ahmet" : undefined,
            duration: isOccupied ? t.duration || "1 dk" : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleCompletePayment = (
    tableId: string,
    paidAmount: number,
    paymentType: string,
    isFullPayment: boolean
  ) => {
    if (isFullPayment) {
      if (activeOrderType !== "table") {
        setTakeawayOrderStub(null);
        setActiveOrderType("table");
      } else {
        setTables((prev) =>
          prev.map((t) =>
            t.id === tableId
              ? { ...t, items: [], status: "empty", customerName: undefined }
              : t
          )
        );
        if (activeTableId === tableId) {
          setActiveTableId(null);
        }
      }
    }
  };

  return (
    <PosContext.Provider
      value={{
        tables,
        setTables,
        products,
        kanbanOrders,
        activeTableId,
        setActiveTableId,
        activeOrderType,
        setActiveOrderType,
        takeawayOrderStub,
        setTakeawayOrderStub,
        handleUpdateTableItems,
        handleCompletePayment,
        totalOpenOrders,
      }}
    >
      {children}
    </PosContext.Provider>
  );
}

export function usePosContext() {
  const context = useContext(PosContext);
  if (context === undefined) {
    throw new Error("usePosContext must be used within a PosProvider");
  }
  return context;
}
