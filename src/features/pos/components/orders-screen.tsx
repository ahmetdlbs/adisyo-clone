"use client";

import { useState } from "react";
import { Bike, Kanban, LayoutGrid, Store, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_IDENTITY } from "@/config/demo-identity";
import { formatKurus } from "@/lib/money";
import { remaining } from "../model/order";
import { orderForTable, orderTitle } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";
import { DiscountDialog } from "./discount-dialog";
import { FloorView } from "./floor-view";
import { MoveTableDialog } from "./move-table-dialog";
import { OrderDetail } from "./order-detail";
import { OrdersBoard } from "./orders-board";
import { PaymentDialog } from "./payment-dialog";
import { TableQuickDialog } from "./table-quick-dialog";

type View = "floor" | "orders";

/** The point-of-sale screen: floor plan and order board, the open bill, and the dialogs around it. */
export function OrdersScreen() {
  const state = usePosState();
  const actions = usePosActions();
  const [view, setView] = useState<View>("floor");
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [quickOrderId, setQuickOrderId] = useState<string | null>(null);
  const [paymentOrderId, setPaymentOrderId] = useState<string | null>(null);
  const [fastPayOrderId, setFastPayOrderId] = useState<string | null>(null);
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null);
  const [moveOrderId, setMoveOrderId] = useState<string | null>(null);
  const [discountOrderId, setDiscountOrderId] = useState<string | null>(null);

  const waiter = DEMO_IDENTITY.name;
  const activeOrder = state.orders.find((order) => order.id === activeOrderId);
  const fastPayOrder = state.orders.find((order) => order.id === fastPayOrderId);
  const cancelOrder = state.orders.find((order) => order.id === cancelOrderId);
  const discountOrder = state.orders.find((order) => order.id === discountOrderId);

  const guard = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İşlem yapılamadı");
    }
  };

  const selectTable = (tableId: string) =>
    guard(async () => {
      const existing = orderForTable(state, tableId);
      setActiveOrderId(existing ? existing.id : await actions.openOrder({ type: "table", tableId, waiter }));
    });

  const startOrder = (type: "takeaway" | "delivery") =>
    guard(async () => setActiveOrderId(await actions.openOrder({ type, tableId: null, customerName: waiter, waiter })));

  // An order nobody added anything to is dropped on the way out, so it never lingers as a phantom.
  const leaveDetail = () => {
    if (activeOrder) void actions.discardEmptyOrder(activeOrder.id);
    setActiveOrderId(null);
  };

  const finished = (orderId: string) => {
    if (activeOrderId === orderId) setActiveOrderId(null);
  };

  const fastPay = (orderId: string) =>
    guard(async () => {
      const order = state.orders.find((candidate) => candidate.id === orderId);
      if (!order) return;
      const due = remaining(order);
      if (due > 0) {
        await actions.applyPayment(orderId, { method: "cash", tendered: due });
      }
      await actions.closeOrder(orderId);
      toast.success("Hızlı ödeme alındı");
      finished(orderId);
    });

  const cancel = (orderId: string) =>
    guard(async () => {
      await actions.cancelOrder(orderId);
      toast.success("Sipariş iptal edildi");
      finished(orderId);
    });

  const applyDiscount = (percent: number) =>
    guard(async () => {
      if (!discountOrder) return;
      await actions.setDiscount(discountOrder.id, percent);
      toast.success(percent > 0 ? `%${percent} indirim uygulandı` : "İndirim kaldırıldı");
      setDiscountOrderId(null);
    });

  return (
    <div className="flex h-full min-h-0 w-full">
      {activeOrder ? (
        <OrderDetail
          orderId={activeOrder.id}
          onBack={leaveDetail}
          onPay={setPaymentOrderId}
          onFastPay={setFastPayOrderId}
          onDiscount={setDiscountOrderId}
        />
      ) : (
        <>
          <nav aria-label="Hızlı sipariş" className="flex w-[72px] shrink-0 flex-col items-center gap-3 border-r bg-card px-2 py-4">
            <RailButton icon={Store} label="Gel Al" onClick={() => startOrder("takeaway")} />
            <RailButton icon={Bike} label="Paket" onClick={() => startOrder("delivery")} />
          </nav>

          <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden px-6 pt-4">
            <Tabs value={view} onValueChange={(value) => setView(value as View)}>
              <TabsList>
                <TabsTrigger value="floor" className="gap-2 px-4">
                  <LayoutGrid className="size-4" />
                  Bölgeler
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2 px-4">
                  <Kanban className="size-4" />
                  Siparişler
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {view === "floor" ? (
              <FloorView onSelectTable={selectTable} onOpenQuick={setQuickOrderId} />
            ) : (
              <OrdersBoard onOpenOrder={setActiveOrderId} onPayOrder={setPaymentOrderId} onCancelOrder={setCancelOrderId} />
            )}
          </div>
        </>
      )}

      <TableQuickDialog
        orderId={quickOrderId}
        onOpenChange={(open) => !open && setQuickOrderId(null)}
        onPay={setPaymentOrderId}
        onFastPay={setFastPayOrderId}
        onCancel={setCancelOrderId}
        onMove={setMoveOrderId}
      />
      <MoveTableDialog orderId={moveOrderId} onOpenChange={(open) => !open && setMoveOrderId(null)} />
      <PaymentDialog
        orderId={paymentOrderId}
        onOpenChange={(open) => !open && setPaymentOrderId(null)}
        onPaid={(orderId) => {
          setPaymentOrderId(null);
          finished(orderId);
        }}
        onRequestDiscount={setDiscountOrderId}
      />
      <DiscountDialog
        open={discountOrder !== undefined}
        currentPercent={discountOrder?.discountPercent ?? 0}
        onOpenChange={(open) => !open && setDiscountOrderId(null)}
        onApply={applyDiscount}
      />

      <ConfirmDialog
        open={fastPayOrder !== undefined}
        onOpenChange={(open) => !open && setFastPayOrderId(null)}
        title="Hızlı ödeme"
        description={
          fastPayOrder
            ? `${orderTitle(state, fastPayOrder)}: ${formatKurus(remaining(fastPayOrder))} nakit tahsil edilip sipariş kapatılsın mı?`
            : undefined
        }
        confirmLabel="Nakit tahsil et"
        onConfirm={() => fastPayOrder && fastPay(fastPayOrder.id)}
      />
      <ConfirmDialog
        open={cancelOrder !== undefined}
        onOpenChange={(open) => !open && setCancelOrderId(null)}
        title="Sipariş iptal edilsin mi?"
        description={cancelOrder ? `${orderTitle(state, cancelOrder)} siparişi iptal edilir ve kayıt altında saklanır.` : undefined}
        confirmLabel="İptal et"
        cancelLabel="Vazgeç"
        destructive
        onConfirm={() => cancelOrder && cancel(cancelOrder.id)}
      />
    </div>
  );
}

function RailButton({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <Button type="button" variant="outline" className="h-16 w-full flex-col gap-1 text-[11px]" onClick={onClick}>
      <Icon className="size-5" />
      {label}
    </Button>
  );
}
