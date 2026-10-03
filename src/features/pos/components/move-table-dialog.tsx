"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { orderForTable, orderTitle } from "../model/pos-state";
import type { Order } from "../model/order";
import { usePosActions, usePosState } from "../store/pos-provider";

interface MoveTableDialogProps {
  /** The order to move; the dialog is open while this is set. */
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
}

/** Picks a free table to move an open bill to. */
export function MoveTableDialog({ orderId, onOpenChange }: MoveTableDialogProps) {
  const state = usePosState();
  const order = orderId ? state.orders.find((candidate) => candidate.id === orderId) : undefined;

  return (
    <Dialog open={order !== undefined} onOpenChange={onOpenChange}>
      {order && <MoveBody key={order.id} order={order} onDone={() => onOpenChange(false)} />}
    </Dialog>
  );
}

function MoveBody({ order, onDone }: { order: Order; onDone: () => void }) {
  const state = usePosState();
  const actions = usePosActions();
  const [targetId, setTargetId] = useState<string | null>(null);

  const areaName = (areaId: string) => state.areas.find((area) => area.id === areaId)?.name ?? "";
  const options = state.tables
    .filter((table) => !orderForTable(state, table.id))
    .map((table) => ({ value: table.id, label: `${areaName(table.areaId)} · ${table.name}` }));

  const move = async () => {
    if (!targetId) return;
    try {
      await actions.moveOrderToTable(order.id, targetId);
      toast.success(`Sipariş ${options.find((option) => option.value === targetId)?.label ?? "masaya"} taşındı`);
      onDone();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Masa değiştirilemedi");
    }
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Masayı Değiştir</DialogTitle>
        <DialogDescription>{orderTitle(state, order)} siparişini taşıyacağınız boş masayı seçiniz.</DialogDescription>
      </DialogHeader>

      <Select items={options} value={targetId} onValueChange={(value) => setTargetId(value)}>
        <SelectTrigger aria-label="Hedef masa" className="w-full">
          <SelectValue placeholder="Masa seçiniz" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DialogFooter>
        <DialogClose render={<Button type="button" variant="outline" />}>Vazgeç</DialogClose>
        <Button type="button" disabled={!targetId} onClick={move}>
          Taşı
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
