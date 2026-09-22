"use client";

import { ArrowRightToLine, ArrowUpDown, CreditCard, Printer, RotateCcw, Scan, Send, Zap, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { notifyUnavailable } from "@/lib/notify";
import { orderTitle } from "../model/pos-state";
import { usePosState } from "../store/pos-provider";

interface TableQuickDialogProps {
  /** The order the actions apply to; the dialog is open while this is set. */
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
  onPay: (orderId: string) => void;
  onFastPay: (orderId: string) => void;
  onCancel: (orderId: string) => void;
  onMove: (orderId: string) => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  run: (orderId: string) => void;
}

/** The 3×3 grid of one-tap operations on an open table. */
export function TableQuickDialog({ orderId, onOpenChange, onPay, onFastPay, onCancel, onMove }: TableQuickDialogProps) {
  const state = usePosState();
  const order = orderId ? state.orders.find((candidate) => candidate.id === orderId) : undefined;

  const actions: readonly QuickAction[] = [
    { id: "pay", label: "Öde", icon: CreditCard, run: onPay },
    { id: "fast-pay", label: "Hızlı Öde", icon: Zap, run: onFastPay },
    { id: "cancel", label: "İptal", icon: RotateCcw, run: onCancel },
    { id: "print", label: "Yazdır", icon: Printer, run: notifyUnavailable },
    { id: "move", label: "Masayı Değiştir", icon: ArrowRightToLine, run: onMove },
    { id: "merge", label: "Masaları Birleştir", icon: Scan, run: notifyUnavailable },
    { id: "transfer", label: "Adisyon Aktar", icon: ArrowUpDown, run: notifyUnavailable },
    { id: "mars", label: "Marşla", icon: Send, run: notifyUnavailable },
  ];

  return (
    <Dialog open={order !== undefined} onOpenChange={onOpenChange}>
      {order && (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Masa Adı: {orderTitle(state, order)}</DialogTitle>
            <DialogDescription>Sipariş veya masa ile ilgili hızlı işlemler</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3">
            {actions.map(({ id, label, icon: Icon, run }) => (
              <Button
                key={id}
                type="button"
                variant="outline"
                className="h-24 flex-col gap-2 text-center whitespace-normal"
                onClick={() => {
                  onOpenChange(false);
                  run(order.id);
                }}
              >
                <Icon className="size-6 text-primary" />
                <span className="text-xs font-semibold">{label}</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
