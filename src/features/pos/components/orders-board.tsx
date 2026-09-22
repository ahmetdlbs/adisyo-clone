"use client";

import { useState } from "react";
import { Bike, Check, CreditCard, MoreHorizontal, Printer, ShoppingBag, Truck, Utensils, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { SearchInput } from "@/components/kit/search-input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatClock } from "@/lib/format";
import { notifyUnavailable } from "@/lib/notify";
import { filterByQuery } from "@/lib/search";
import { useNow } from "../hooks/use-now";
import { formatKurus } from "@/lib/money";
import { dispatchDelivery, isLate, markReady, orderTotal, type Order, type OrderStage, type OrderType } from "../model/order";
import { orderTitle } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";

const COLUMNS: readonly { stage: OrderStage; title: string }[] = [
  { stage: "preparing", title: "Hazırlanıyor" },
  { stage: "ready", title: "Bekleyen Siparişler" },
  { stage: "out_for_delivery", title: "Teslimata Çıkanlar" },
];

const TYPE_ICON: Record<OrderType, LucideIcon> = { table: Utensils, takeaway: ShoppingBag, delivery: Bike };
const TYPE_STYLE: Record<OrderType, string> = {
  table: "bg-warning/15 text-warning",
  takeaway: "bg-success/15 text-success",
  delivery: "bg-primary/15 text-primary",
};

interface OrdersBoardProps {
  onOpenOrder: (orderId: string) => void;
  onPayOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string) => void;
}

/** Kanban of open orders by kitchen stage. Orders nothing was added to yet are not shown. */
export function OrdersBoard({ onOpenOrder, onPayOrder, onCancelOrder }: OrdersBoardProps) {
  const state = usePosState();
  const now = useNow();
  const [query, setQuery] = useState("");

  const orders = filterByQuery(
    state.orders.filter((order) => order.lines.length > 0),
    query,
    (order) => `${orderTitle(state, order)} #${order.number} ${order.customerName ?? ""}`
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <SearchInput className="w-80" value={query} onValueChange={setQuery} placeholder="Sipariş ara..." aria-label="Sipariş ara" />

      <div className="grid min-h-0 flex-1 gap-4 overflow-x-auto pb-4 md:grid-cols-3">
        {COLUMNS.map(({ stage, title }) => {
          const inColumn = orders.filter((order) => order.stage === stage);
          return (
            <section key={stage} aria-label={title} className="flex min-h-0 flex-col rounded-lg bg-muted/60 p-3">
              <h3 className="mb-3 text-sm font-semibold">
                {title} ({inColumn.length})
              </h3>
              <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
                {inColumn.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Sipariş yok</p>}
                {inColumn.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    title={orderTitle(state, order)}
                    now={now}
                    onOpen={() => onOpenOrder(order.id)}
                    onPay={() => onPayOrder(order.id)}
                    onCancel={() => onCancelOrder(order.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
  title: string;
  now: Date | null;
  onOpen: () => void;
  onPay: () => void;
  onCancel: () => void;
}

function OrderCard({ order, title, now, onOpen, onPay, onCancel }: OrderCardProps) {
  const actions = usePosActions();
  const Icon = TYPE_ICON[order.type];

  // What moves the order along from where it is: mark it ready, then (for delivery) send it out.
  const advance =
    order.stage === "preparing"
      ? { label: "Hazır işaretle", icon: Check, change: markReady }
      : order.type === "delivery" && order.stage === "ready"
        ? { label: "Teslimata çıkar", icon: Truck, change: dispatchDelivery }
        : null;

  const runAdvance = () => {
    if (!advance) return;
    try {
      actions.updateOrder(order.id, advance.change);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İşlem yapılamadı");
    }
  };

  return (
    <article aria-label={`${title} siparişi`} className="rounded-xl border bg-card shadow-sm">
      {now !== null && isLate(order, now) && (
        <div className="px-3 pt-2.5">
          <Badge variant="warning">Geciken Sipariş</Badge>
        </div>
      )}

      <button type="button" aria-label={`${title} adisyonunu aç`} onClick={onOpen} className="flex w-full items-center gap-3 p-3 text-left">
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-full ${TYPE_STYLE[order.type]}`}>
          <Icon className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-bold">{title}</span>
          <span className="block text-[11px] text-muted-foreground">{now ? formatClock(order.openedAt) : ""}</span>
        </span>
        <span className="text-[13px] font-bold text-muted-foreground">#{order.number}</span>
      </button>

      <p className="px-3 pb-2 text-right text-[15px] font-extrabold">{formatKurus(orderTotal(order))}</p>

      <div className="flex items-center justify-around border-t p-1.5">
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`${title} yazdır`} onClick={notifyUnavailable}>
          <Printer />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label={`${title} öde`} onClick={onPay}>
          <CreditCard />
        </Button>
        {advance && (
          <Button type="button" variant="ghost" size="icon-sm" aria-label={`${title}: ${advance.label}`} onClick={runAdvance}>
            <advance.icon />
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`${title} daha fazla`} />}>
            <MoreHorizontal />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={onCancel}>
              Siparişi İptal Et
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </article>
  );
}
