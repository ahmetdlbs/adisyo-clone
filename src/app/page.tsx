"use client";

import React, { useState } from "react";
import LoginPage from "@/components/LoginPage";
import TopHeader from "@/components/TopHeader";
import SideDrawer, { ViewType } from "@/components/SideDrawer";
import DashboardView from "@/components/DashboardView";
import OrderPosView from "@/components/OrderPosView";
import TableOrderDetailView from "@/components/TableOrderDetailView";
import TableAreaDefinitionView from "@/components/TableAreaDefinitionView";
import ProductDefinitionView from "@/components/ProductDefinitionView";
import EndOfDayReportView from "@/components/EndOfDayReportView";
import KitchenScreenView from "@/components/KitchenScreenView";
import ExpenseManagementView from "@/components/ExpenseManagementView";
import TableQuickModal from "@/components/TableQuickModal";
import PaymentModal from "@/components/PaymentModal";
import {
  INITIAL_TABLES,
  INITIAL_PRODUCTS,
  INITIAL_KANBAN_ORDERS,
  TableData,
  ProductItem,
  OrderItem,
  KanbanOrder,
} from "@/data/posData";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");

  const [currentView, setCurrentView] = useState<ViewType>("order");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [tables, setTables] = useState<TableData[]>(INITIAL_TABLES);
  const [products] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [kanbanOrders, setKanbanOrders] = useState<KanbanOrder[]>(INITIAL_KANBAN_ORDERS);

  // Active Order Detail State
  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [activeOrderType, setActiveOrderType] = useState<"table" | "gel-al" | "paket">("table");

  // Temporary takeaway / delivery order table stub
  const [takeawayOrderStub, setTakeawayOrderStub] = useState<TableData | null>(null);

  const [quickModalTable, setQuickModalTable] = useState<TableData | null>(null);
  const [paymentModalTable, setPaymentModalTable] = useState<TableData | null>(null);

  const activeTable =
    activeOrderType === "table"
      ? tables.find((t) => t.id === activeTableId) || null
      : takeawayOrderStub;

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

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setCurrentView("order");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsDrawerOpen(false);
    setActiveTableId(null);
    setTakeawayOrderStub(null);
  };

  const handleSelectTable = (table: TableData) => {
    setActiveTableId(table.id);
    setActiveOrderType("table");
  };

  // Direct Gel Al order opening
  const handleOpenGelAl = () => {
    const stub: TableData = {
      id: `gel-al-${Date.now()}`,
      name: "Gel Al Sipariş",
      section: "salon",
      status: "occupied",
      customerName: "Ahmet",
      waiter: "ahmet",
      orderNumber: 0,
      duration: "Az önce",
      items: [],
    };
    setTakeawayOrderStub(stub);
    setActiveOrderType("gel-al");
  };

  // Direct Paket order opening
  const handleOpenPaket = () => {
    const stub: TableData = {
      id: `paket-${Date.now()}`,
      name: "Paket Sipariş",
      section: "salon",
      status: "occupied",
      customerName: "Ahmet",
      waiter: "ahmet",
      orderNumber: 0,
      duration: "Az önce",
      items: [],
    };
    setTakeawayOrderStub(stub);
    setActiveOrderType("paket");
  };

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

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#edf0f5]">
      {/* If in Table / Gel Al / Paket Order detail view */}
      {activeTable ? (
        <TableOrderDetailView
          table={activeTable}
          products={products}
          orderType={activeOrderType}
          onBack={() => {
            setActiveTableId(null);
            setTakeawayOrderStub(null);
            setActiveOrderType("table");
          }}
          onUpdateTableItems={handleUpdateTableItems}
          onOpenPayment={() => setPaymentModalTable(activeTable)}
          onQuickPay={() => setPaymentModalTable(activeTable)}
        />
      ) : currentView === "dashboard" ? (
        <div className="flex flex-col h-full overflow-hidden">
          <TopHeader onToggleMenu={() => setIsDrawerOpen(true)} />
          <DashboardView
            openOrdersTotal={totalOpenOrders}
            guestCount={2}
          />
        </div>
      ) : currentView === "table-area-definition" ? (
        <TableAreaDefinitionView
          tables={tables}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onSelectTable={(tbl) => {
            setCurrentView("order");
            setActiveTableId(tbl.id);
            setActiveOrderType("table");
          }}
        />
      ) : currentView === "product-definition" ? (
        <ProductDefinitionView
          products={products}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      ) : currentView === "reports" ? (
        <EndOfDayReportView
          onOpenDrawer={() => setIsDrawerOpen(true)}
          openOrdersTotal={totalOpenOrders}
        />
      ) : currentView === "kitchen" ? (
        <KitchenScreenView
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onBack={() => setCurrentView("order")}
        />
      ) : currentView === "expenses" ? (
        <ExpenseManagementView
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      ) : (
        <OrderPosView
          tables={tables}
          kanbanOrders={kanbanOrders}
          onOpenDrawer={() => setIsDrawerOpen(true)}
          onSelectTable={handleSelectTable}
          onOpenTableQuickModal={(tbl) => setQuickModalTable(tbl)}
          onSelectKanbanOrder={(ord) => {
            if (ord.type === "table") {
              const matched = tables.find((t) => t.name === ord.title);
              if (matched) {
                setActiveTableId(matched.id);
                setActiveOrderType("table");
              }
            } else if (ord.type === "takeaway") {
              // Open as Gel Al order stub
              const stub = {
                id: ord.id,
                name: ord.title,
                section: "salon" as const,
                status: "occupied" as const,
                customerName: ord.customerName,
                waiter: "ahmet",
                orderNumber: parseInt(ord.orderNo.replace("#", "")) || 0,
                duration: ord.time,
                items: [],
              };
              setTakeawayOrderStub(stub);
              setActiveOrderType("gel-al");
            } else if (ord.type === "delivery") {
              const stub = {
                id: ord.id,
                name: ord.title,
                section: "salon" as const,
                status: "occupied" as const,
                customerName: ord.customerName,
                waiter: "ahmet",
                orderNumber: parseInt(ord.orderNo.replace("#", "")) || 0,
                duration: ord.time,
                items: [],
              };
              setTakeawayOrderStub(stub);
              setActiveOrderType("paket");
            }
          }}
          onQuickGelAl={handleOpenGelAl}
          onQuickPaket={handleOpenPaket}
          onLogout={handleLogout}
        />
      )}

      {/* Side Navigation Drawer */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSelectView={(v) => {
          setCurrentView(v);
          setActiveTableId(null);
          setTakeawayOrderStub(null);
        }}
        onLogout={handleLogout}
      />

      {/* Table 3-Dots Quick Operations Modal (3x3 grid) */}
      <TableQuickModal
        table={quickModalTable}
        isOpen={!!quickModalTable}
        onClose={() => setQuickModalTable(null)}
        onQuickPay={(tbl) => {
          setQuickModalTable(null);
          setPaymentModalTable(tbl);
        }}
        onPrintBill={(tbl) => {
          setQuickModalTable(null);
          alert(`${tbl.name} adisyonu yazdırıldı.`);
        }}
      />

      {/* Payment Screen Modal */}
      <PaymentModal
        table={paymentModalTable}
        isOpen={!!paymentModalTable}
        onClose={() => setPaymentModalTable(null)}
        onCompletePayment={handleCompletePayment}
      />
    </div>
  );
}
