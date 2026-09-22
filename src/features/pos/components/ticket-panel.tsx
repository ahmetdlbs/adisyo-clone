"use client";

import { Gift, MoreVertical, Tag, Trash2, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatKurus } from "@/lib/money";
import {
  discountAmount,
  isLineSettled,
  lineTotal,
  orderTotal,
  paidTotal,
  remaining,
  subtotal,
  type Order,
  type OrderLine,
} from "../model/order";

interface TicketPanelProps {
  order: Order;
  onToggleComplimentary: (lineId: string) => void;
  onRemoveLine: (lineId: string) => void;
  onDiscount: () => void;
  onPay: () => void;
  onFastPay: () => void;
  onSave: () => void;
}

/** The bill: its lines, the totals and the pay / discount / save buttons. */
export function TicketPanel({ order, onToggleComplimentary, onRemoveLine, onDiscount, onPay, onFastPay, onSave }: TicketPanelProps) {
  const discount = discountAmount(order);
  const paid = paidTotal(order);

  return (
    <aside aria-label="Adisyon" className="flex w-[390px] shrink-0 flex-col justify-between border-r bg-muted/40">
      <ul className="flex-1 overflow-y-auto px-2 py-3">
        {order.lines.length === 0 && <li className="p-6 text-center text-sm text-muted-foreground">Adisyon boş. Sağdan ürün ekleyin.</li>}
        {order.lines.map((line) => (
          <TicketLine
            key={line.id}
            line={line}
            isSettled={isLineSettled(order, line.id)}
            onToggleComplimentary={() => onToggleComplimentary(line.id)}
            onRemove={() => onRemoveLine(line.id)}
          />
        ))}
      </ul>

      <div className="shrink-0 border-t p-3">
        <dl className="mb-3 grid grid-cols-2 gap-y-1 text-sm">
          {discount > 0 && (
            <>
              <dt className="text-muted-foreground">Ara Toplam</dt>
              <dd className="text-right">{formatKurus(subtotal(order))}</dd>
              <dt className="text-muted-foreground">İndirim (%{order.discountPercent})</dt>
              <dd className="text-right text-destructive">−{formatKurus(discount)}</dd>
            </>
          )}
          <dt className="text-[15px] font-bold">Toplam Tutar</dt>
          <dd className="text-right text-[15px] font-bold">{formatKurus(orderTotal(order))}</dd>
          {paid > 0 && (
            <>
              <dt className="text-muted-foreground">Ödenen</dt>
              <dd className="text-right">{formatKurus(paid)}</dd>
              <dt className="text-muted-foreground">Kalan</dt>
              <dd className="text-right font-semibold">{formatKurus(remaining(order))}</dd>
            </>
          )}
        </dl>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="icon-xl" aria-label="İndirim" onClick={onDiscount}>
            <Tag />
          </Button>
          <Button type="button" variant="success" size="xl" className="flex-1 font-bold" disabled={order.lines.length === 0} onClick={onPay}>
            ÖDE {formatKurus(remaining(order))}
          </Button>
          <Button type="button" variant="outline" size="xl" disabled={order.lines.length === 0} onClick={onFastPay}>
            <Zap />
            HIZLI ÖDE
          </Button>
          <Button type="button" size="xl" className="font-bold" onClick={onSave}>
            KAYDET
          </Button>
        </div>
      </div>
    </aside>
  );
}

interface TicketLineProps {
  line: OrderLine;
  isSettled: boolean;
  onToggleComplimentary: () => void;
  onRemove: () => void;
}

function TicketLine({ line, isSettled, onToggleComplimentary, onRemove }: TicketLineProps) {
  return (
    <li className="flex items-start gap-3 border-b px-2 py-2.5 last:border-b-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-sm font-semibold">{line.quantity}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{line.name}</p>
        <p className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
          {line.quantity} × {formatKurus(line.unitPrice)}
          {line.isComplimentary && <Badge variant="warning">İkram</Badge>}
          {isSettled && <Badge variant="success">Ödendi</Badge>}
        </p>
      </div>
      <span className="text-[13px] font-semibold">{formatKurus(lineTotal(line))}</span>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`${line.name} işlemleri`} disabled={isSettled} />}>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onClick={onToggleComplimentary}>
            <Gift />
            {line.isComplimentary ? "İkramı Kaldır" : "İkram"}
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={onRemove}>
            <Trash2 />
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
