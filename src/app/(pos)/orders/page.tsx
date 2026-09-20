"use client";

import React, { useState } from 'react';
import OrderPosView from '@/components/OrderPosView';
import TableOrderDetailView from '@/components/TableOrderDetailView';
import TableQuickModal from '@/components/TableQuickModal';
import PaymentModal from '@/components/PaymentModal';
import { usePosContext } from '@/context/PosContext';
import { useShell } from '@/components/shell/ShellContext';
import { TableData } from '@/data/posData';

export default function OrdersPage() {
  const {
    tables,
    products,
    kanbanOrders,
    activeTableId,
    setActiveTableId,
    activeOrderType,
    setActiveOrderType,
    takeawayOrderStub,
    setTakeawayOrderStub,
    handleUpdateTableItems,
    handleCompletePayment
  } = usePosContext();

  const { openDrawer } = useShell();

  const [quickModalTable, setQuickModalTable] = useState<TableData | null>(null);
  const [paymentModalTable, setPaymentModalTable] = useState<TableData | null>(null);

  const activeTable =
    activeOrderType === "table"
      ? tables.find((t) => t.id === activeTableId) || null
      : takeawayOrderStub;

  const handleSelectTable = (table: TableData) => {
    setActiveTableId(table.id);
    setActiveOrderType("table");
  };

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

  const getTableDataFromKanban = (ord: KanbanOrder): TableData | null => {
    if (ord.type === "table") {
      return tables.find((t) => t.name === ord.title) || null;
    }
    return {
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
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#edf0f5]">
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
      ) : (
        <OrderPosView
          tables={tables}
          kanbanOrders={kanbanOrders}
          onOpenDrawer={openDrawer}
          onSelectTable={handleSelectTable}
          onOpenTableQuickModal={(tbl) => setQuickModalTable(tbl)}
          onSelectKanbanOrder={(ord) => {
            const matched = getTableDataFromKanban(ord);
            if (matched) {
              if (ord.type === "table") {
                setActiveTableId(matched.id);
                setActiveOrderType("table");
              } else if (ord.type === "takeaway") {
                setTakeawayOrderStub(matched);
                setActiveOrderType("gel-al");
              } else if (ord.type === "delivery") {
                setTakeawayOrderStub(matched);
                setActiveOrderType("paket");
              }
            }
          }}
          onPrintKanbanOrder={(ord) => alert(`${ord.title} adisyonu yazdırıldı.`)}
          onPayKanbanOrder={(ord) => {
            const tbl = getTableDataFromKanban(ord);
            if (tbl) setPaymentModalTable(tbl);
          }}
          onCancelKanbanOrder={(ord) => alert(`${ord.title} siparişi iptal edildi.`)}
          onMarkReadyKanbanOrder={(ord) => alert(`${ord.title} hazır olarak işaretlendi!`)}
          onQuickGelAl={handleOpenGelAl}
          onQuickPaket={handleOpenPaket}
          onLogout={() => {}}
        />
      )}

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
