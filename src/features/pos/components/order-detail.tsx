"use client";

import { useState } from "react";
import { ArrowLeft, Printer, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/kit/confirm-dialog";
import { SearchInput } from "@/components/kit/search-input";
import { Button } from "@/components/ui/button";
import { notifyUnavailable } from "@/lib/notify";
import type { OrderStage } from "../model/order";
import { orderTitle, type Product } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";
import { MenuPanel } from "./menu-panel";
import { TicketPanel } from "./ticket-panel";

const STAGE_LABELS: Record<OrderStage, string> = {
  preparing: "Hazırlanıyor",
  ready: "Hazır",
  out_for_delivery: "Teslimatta",
};

interface OrderDetailProps {
  orderId: string;
  onBack: () => void;
  onPay: (orderId: string) => void;
  onFastPay: (orderId: string) => void;
  onDiscount: (orderId: string) => void;
}

/** One open bill: its ticket on the left, the menu to add from on the right. */
export function OrderDetail({ orderId, onBack, onPay, onFastPay, onDiscount }: OrderDetailProps) {
  const state = usePosState();
  const actions = usePosActions();
  const [query, setQuery] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);

  const order = state.orders.find((candidate) => candidate.id === orderId);
  if (!order) return null;

  // The API refuses edits that would corrupt a bill (e.g. changing an already-paid line).
  const run = async (action: () => Promise<unknown>) => {
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İşlem yapılamadı");
    }
  };

  const add = (product: Product, portionId: string) => run(() => actions.addProduct(order.id, product.id, portionId));

  const save = () => {
    toast.success("Sipariş kaydedildi");
    onBack();
  };

  return (
    <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
      <header className="flex h-[50px] shrink-0 items-stretch bg-muted">
        <div className="flex w-[390px] shrink-0 items-center justify-between bg-foreground px-3 text-background">
          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Geri" className="text-background hover:bg-background/10 hover:text-background" onClick={onBack}>
              <ArrowLeft />
            </Button>
            <h2 className="text-[15px] font-semibold">{orderTitle(state, order)}</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Yazdır" className="text-background hover:bg-background/10 hover:text-background" onClick={notifyUnavailable}>
              <Printer />
            </Button>
            <Button type="button" variant="ghost" size="sm" className="text-xs font-bold tracking-wider text-background hover:bg-background/10 hover:text-background" onClick={notifyUnavailable}>
              MARŞ
            </Button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between gap-3 px-4">
          <SearchInput className="max-w-xl flex-1 bg-card" value={query} onValueChange={setQuery} placeholder="Ürün adı ile arama" aria-label="Ürün ara" />
          <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
            <span>Adisyon: {order.number}</span>
            <span>Sipariş Durumu: {STAGE_LABELS[order.stage]}</span>
            <Button type="button" variant="ghost" size="icon-sm" aria-label="Siparişi sıfırla" onClick={() => setIsResetOpen(true)}>
              <RotateCcw />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <TicketPanel
          order={order}
          onToggleComplimentary={(lineId) => run(() => actions.toggleComplimentary(order.id, lineId))}
          onRemoveLine={(lineId) => run(() => actions.removeLine(order.id, lineId))}
          onDiscount={() => onDiscount(order.id)}
          onToggleCharge={(which, isOn) => {
            const current = order.charges ?? [];
            const has = (name: "kuver" | "garsoniye") => current.some((charge) => charge.which === name);
            return run(() => actions.setCharges(order.id, { kuver: which === "kuver" ? isOn : has("kuver"), garsoniye: which === "garsoniye" ? isOn : has("garsoniye") }));
          }}
          onPay={() => onPay(order.id)}
          onFastPay={() => onFastPay(order.id)}
          onSave={save}
        />
        <MenuPanel
          products={state.products}
          categories={state.categories}
          order={order}
          query={query}
          onAdd={add}
          onDecrement={(product, portionId) => run(() => actions.decrementProduct(order.id, product.id, portionId))}
        />
      </div>

      <ConfirmDialog
        open={isResetOpen}
        onOpenChange={setIsResetOpen}
        title="Sipariş sıfırlansın mı?"
        description="Ödenmemiş tüm kalemler adisyondan silinir. Ödenmiş kalemler ve tahsilatlar kalır."
        confirmLabel="Sıfırla"
        destructive
        onConfirm={() => run(() => actions.resetOrder(order.id))}
      />
    </div>
  );
}
