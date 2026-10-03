"use client";

import Link from "next/link";
import { ArrowLeft, ChefHat, Settings, Sparkles, User } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { ROUTES } from "@/config/routes";
import { notifyUnavailable } from "@/lib/notify";
import { useNow } from "../hooks/use-now";
import { elapsedLabel, isLate, lineTotal, type Order } from "../model/order";
import { orderTitle } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";

/** Tickets for the kitchen: every open order still being prepared, with a single "Tümü Hazır" per order — the
 * order model has no notion of one line being ready before another. */
export function KitchenScreen() {
  const state = usePosState();
  const actions = usePosActions();
  const now = useNow();

  const preparing = state.orders.filter((order) => order.stage === "preparing" && order.lines.length > 0);

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <div className="flex items-center justify-between">
        <Link href={ROUTES.orders} className="inline-flex items-center gap-2 rounded-full bg-muted px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-muted/70">
          <ArrowLeft className="size-4" />
          Geri Dön
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="rounded-full" onClick={notifyUnavailable}>
            Sırala
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full" onClick={notifyUnavailable}>
            <Settings />
            Ayarlar
          </Button>
        </div>
      </div>

      {preparing.length === 0 ? (
        <Empty className="flex-1">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Sparkles />
            </EmptyMedia>
            <EmptyDescription>Tüm mutfak siparişleri hazırlandı. Yeni sipariş bekleniyor...</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {preparing.map((order) => (
            <KitchenTicket
              key={order.id}
              order={order}
              title={orderTitle(state, order)}
              now={now}
              onReady={() => {
                actions.markReady(order.id).catch((error: unknown) => {
                  toast.error(error instanceof Error ? error.message : "İşlem yapılamadı");
                });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function KitchenTicket({
  order,
  title,
  now,
  onReady,
}: {
  order: Order;
  title: string;
  now: Date | null;
  onReady: () => void;
}) {
  const late = now !== null && isLate(order, now);

  return (
    <article aria-label={`${title} adisyonu`} className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <header className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-warning/20 text-warning">
            <ChefHat className="size-5" />
          </div>
          <div>
            <span className="block text-sm font-bold text-foreground">
              {title} <span className="font-normal text-muted-foreground">/ {order.number}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <User className="size-3.5" />
              {order.waiter}
            </span>
          </div>
        </div>
        <Button size="sm" variant="secondary" onClick={onReady}>
          Tümü Hazır
        </Button>
      </header>

      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <Badge variant="warning">Hazırlanıyor</Badge>
          <span className={late ? "font-mono text-xs font-semibold text-destructive" : "font-mono text-xs text-muted-foreground"}>
            {now && elapsedLabel(order.openedAt, now)}
            {late && " · Geç kaldı"}
          </span>
        </div>
        <ul className="flex flex-col gap-1">
          {order.lines.map((line) => (
            <li key={line.id} className="text-[13px] text-foreground">
              {line.quantity} x {line.name}
              {lineTotal(line) === 0 && <span className="ml-1 text-muted-foreground">(ikram)</span>}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
