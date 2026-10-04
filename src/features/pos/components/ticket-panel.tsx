"use client";

import {
  Gift,
  Minus,
  MoreVertical,
  Plus,
  ReceiptText,
  Tag,
  Trash2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatKurus } from "@/lib/money";
import {
  chargeAmount,
  discountAmount,
  isLineSettled,
  lineTotal,
  orderTotal,
  paidTotal,
  remaining,
  subtotal,
  type Order,
  type OrderCharge,
  type OrderLine,
} from "../model/order";

interface TicketPanelProps {
  order: Order;
  onToggleComplimentary: (lineId: string) => void;
  onRemoveLine: (lineId: string) => void;
  onDiscount: () => void;
  onToggleCharge: (which: "kuver" | "garsoniye", isOn: boolean) => void;
  onGuestsChange: (count: number) => void;
  onPay: () => void;
  onFastPay: () => void;
  onSave: () => void;
}

/** The bill: its lines, the totals and the pay / discount / save buttons. */
export function TicketPanel({
  order,
  onToggleComplimentary,
  onRemoveLine,
  onDiscount,
  onToggleCharge,
  onGuestsChange,
  onPay,
  onFastPay,
  onSave,
}: TicketPanelProps) {
  const discount = discountAmount(order);
  const paid = paidTotal(order);
  const charges = order.charges ?? [];
  const guests = order.guestCount ?? 1;
  const hasCharge = (which: "kuver" | "garsoniye") =>
    charges.some((charge) => charge.which === which);

  return (
    <aside
      aria-label="Adisyon"
      className="flex w-[390px] shrink-0 flex-col justify-between border-r bg-muted/40"
    >
      <ul className="flex-1 overflow-y-auto px-2 py-3">
        {order.lines.length === 0 && (
          <li className="p-6 text-center text-sm text-muted-foreground">
            Adisyon boş. Sağdan ürün ekleyin.
          </li>
        )}
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
          {(discount > 0 || charges.length > 0) && (
            <>
              <dt className="text-muted-foreground">Ara Toplam</dt>
              <dd className="text-right">{formatKurus(subtotal(order))}</dd>
              {discount > 0 && (
                <>
                  <dt className="text-muted-foreground">
                    İndirim (%{order.discountPercent})
                  </dt>
                  <dd className="text-right text-destructive">
                    −{formatKurus(discount)}
                  </dd>
                </>
              )}
              {charges.map((charge) => (
                <ChargeRow
                  key={charge.which}
                  name={chargeLabel(charge, guests)}
                  amount={chargeAmount(order, charge)}
                />
              ))}
            </>
          )}
          <dt className="text-[15px] font-bold">Toplam Tutar</dt>
          <dd className="text-right text-[15px] font-bold">
            {formatKurus(orderTotal(order))}
          </dd>
          {paid > 0 && (
            <>
              <dt className="text-muted-foreground">Ödenen</dt>
              <dd className="text-right">{formatKurus(paid)}</dd>
              <dt className="text-muted-foreground">Kalan</dt>
              <dd className="text-right font-semibold">
                {formatKurus(remaining(order))}
              </dd>
            </>
          )}
        </dl>

        <div className="grid gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="justify-self-start text-muted-foreground"
                />
              }
            >
              <ReceiptText />
              Servis ücreti
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              <DropdownMenuItem
                onClick={() => onToggleCharge("kuver", !hasCharge("kuver"))}
              >
                {hasCharge("kuver") ? "Kuveri kaldır" : "Kuver ekle"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  onToggleCharge("garsoniye", !hasCharge("garsoniye"))
                }
              >
                {hasCharge("garsoniye")
                  ? "Garsoniyeyi kaldır"
                  : "Garsoniye ekle"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {hasCharge("kuver") && (
            <div
              role="group"
              aria-label="Kişi sayısı"
              className="flex items-center justify-between rounded-lg border bg-card px-3 py-1.5 text-sm"
            >
              <span className="text-muted-foreground">Kişi sayısı (kuver)</span>
              <span className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Kişi sayısını azalt"
                  disabled={guests <= 1}
                  onClick={() => onGuestsChange(guests - 1)}
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center font-semibold tabular-nums">
                  {guests}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Kişi sayısını arttır"
                  disabled={guests >= 99}
                  onClick={() => onGuestsChange(guests + 1)}
                >
                  <Plus />
                </Button>
              </span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant="outline"
              size="xl"
              aria-label="İndirim"
              onClick={onDiscount}
            >
              <Tag />
              İndirim
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xl"
              disabled={order.lines.length === 0}
              onClick={onFastPay}
            >
              <Zap />
              HIZLI ÖDE
            </Button>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <Button
              type="button"
              variant="success"
              size="xl"
              className="min-w-0 font-bold"
              disabled={order.lines.length === 0}
              onClick={onPay}
            >
              <span className="truncate">
                ÖDE {formatKurus(remaining(order))}
              </span>
            </Button>
            <Button
              type="button"
              size="xl"
              className="px-6 font-bold"
              onClick={onSave}
            >
              KAYDET
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/** "Kuver × 4" for a per-guest fixed charge, "Garsoniye (%10)" for a percent one, the plain name otherwise. */
function chargeLabel(charge: OrderCharge, guests: number): string {
  if (charge.kind === "percent") return `${charge.name} (%${charge.amount})`;
  return charge.which === "kuver" && guests > 1
    ? `${charge.name} × ${guests}`
    : charge.name;
}

function ChargeRow({ name, amount }: { name: string; amount: number }) {
  return (
    <>
      <dt className="text-muted-foreground">{name}</dt>
      <dd className="text-right">{formatKurus(amount)}</dd>
    </>
  );
}

interface TicketLineProps {
  line: OrderLine;
  isSettled: boolean;
  onToggleComplimentary: () => void;
  onRemove: () => void;
}

function TicketLine({
  line,
  isSettled,
  onToggleComplimentary,
  onRemove,
}: TicketLineProps) {
  return (
    <li className="flex items-start gap-3 border-b px-2 py-2.5 last:border-b-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded bg-muted text-sm font-semibold">
        {line.quantity}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium">{line.name}</p>
        <p className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
          {line.quantity} × {formatKurus(line.unitPrice)}
          {line.isComplimentary && <Badge variant="warning">İkram</Badge>}
          {isSettled && <Badge variant="success">Ödendi</Badge>}
        </p>
      </div>
      <span className="text-[13px] font-semibold">
        {formatKurus(lineTotal(line))}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`${line.name} işlemleri`}
              disabled={isSettled}
            />
          }
        >
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
