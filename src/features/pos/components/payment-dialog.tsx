"use client";

import { useState } from "react";
import { Banknote, Coins, CreditCard, Ellipsis, HandCoins, Ticket, Utensils, Wallet, type LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Customer } from "@/features/customers/model/customer";
import { fetchCustomers } from "@/features/customers/server/customer-actions";
import { cn } from "@/lib/utils";
import { pressKey, typedAmount } from "../model/amount-input";
import { formatKurus, splitEvenly, toAmountText } from "@/lib/money";
import {
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  canClose,
  isLineSettled,
  lineTotal,
  orderTotal,
  paidTotal,
  remaining,
  selectionAmount,
  type Order,
  type PaymentMethod,
} from "../model/order";
import { orderTitle } from "../model/pos-state";
import { usePosActions, usePosState } from "../store/pos-provider";
import { Numpad, type NumpadAction } from "./numpad";

const METHOD_ICONS: Record<PaymentMethod, LucideIcon> = {
  cash: Banknote,
  card: CreditCard,
  multinet: Utensils,
  smart_ticket: Ticket,
  setcard: Wallet,
  pluxee: Coins,
  other: Ellipsis,
  on_account: HandCoins,
};

interface PaymentDialogProps {
  /** The order being paid; the dialog is open while this is set. */
  orderId: string | null;
  onOpenChange: (open: boolean) => void;
  /** Called once the order is fully paid and closed. */
  onPaid: (orderId: string) => void;
  onRequestDiscount: (orderId: string) => void;
}

export function PaymentDialog({ orderId, onOpenChange, onPaid, onRequestDiscount }: PaymentDialogProps) {
  const state = usePosState();
  const order = orderId ? state.orders.find((candidate) => candidate.id === orderId) : undefined;

  return (
    <Dialog open={order !== undefined} onOpenChange={onOpenChange}>
      {order && (
        <PaymentBody
          key={order.id}
          order={order}
          title={orderTitle(state, order)}
          onPaid={onPaid}
          onRequestDiscount={onRequestDiscount}
        />
      )}
    </Dialog>
  );
}

interface PaymentBodyProps {
  order: Order;
  title: string;
  onPaid: (orderId: string) => void;
  onRequestDiscount: (orderId: string) => void;
}

function PaymentBody({ order, title, onPaid, onRequestDiscount }: PaymentBodyProps) {
  const actions = usePosActions();
  const [selectedLineIds, setSelectedLineIds] = useState<readonly string[]>([]);
  const [text, setText] = useState("");
  const [people, setPeople] = useState(2);
  // Veresiye: the customer list is only fetched when "Ödenmez" is pressed; null while the picker is closed.
  const [accountCustomers, setAccountCustomers] = useState<readonly Customer[] | null>(null);
  const [accountCustomerId, setAccountCustomerId] = useState("");

  const due = remaining(order);
  const payableLines = order.lines.filter((line) => !line.isComplimentary && !isLineSettled(order, line.id));
  const typed = typedAmount(text);
  const selection = selectedLineIds.length > 0 ? selectionAmount(order, selectedLineIds) : null;
  const amountToPay = typed ?? selection ?? due;
  const canPay = due > 0 && amountToPay > 0;

  const handleKey = (action: NumpadAction) => {
    if (action === "all") {
      setSelectedLineIds(payableLines.map((line) => line.id));
      setText("");
    } else if (action === "split") {
      setText(toAmountText(splitEvenly(due, people)[0] ?? 0));
      setSelectedLineIds([]);
    } else if (action === "discount") {
      onRequestDiscount(order.id);
    } else if (action === "clear") {
      setText("");
      setSelectedLineIds([]);
    } else {
      setText((current) => pressKey(current, action));
    }
  };

  const toggleLine = (lineId: string) => {
    setSelectedLineIds((current) => (current.includes(lineId) ? current.filter((id) => id !== lineId) : [...current, lineId]));
    setText("");
  };

  const pay = async (method: PaymentMethod, customerId?: string) => {
    try {
      const result = await actions.applyPayment(order.id, {
        method,
        tendered: amountToPay,
        // Lines are marked paid only when the amount came from picking them, not from a typed figure.
        lineIds: typed === null && selection !== null ? selectedLineIds : [],
        ...(customerId ? { customerId } : {}),
      });
      if (result.change > 0) toast.success(`Para üstü: ${formatKurus(result.change)}`);

      if (canClose(result.order)) {
        await actions.closeOrder(order.id);
        toast.success("Ödeme tamamlandı");
        onPaid(order.id);
        return;
      }
      toast.success(`${PAYMENT_METHOD_LABELS[method]} ile ${formatKurus(Math.min(amountToPay, due))} tahsil edildi`);
      setSelectedLineIds([]);
      setText("");
      setAccountCustomers(null);
      setAccountCustomerId("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ödeme alınamadı");
    }
  };

  const chooseMethod = async (method: PaymentMethod) => {
    if (method !== "on_account") return pay(method);
    // Offer to charge the amount to a customer's account; with no customers (or none reachable) it is a plain "Ödenmez".
    const customers = await fetchCustomers().catch(() => []);
    if (customers.length === 0) return pay(method);
    setAccountCustomers(customers);
  };

  const closeWithoutPayment = async () => {
    try {
      await actions.closeOrder(order.id);
      toast.success("Sipariş kapatıldı");
      onPaid(order.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sipariş kapatılamadı");
    }
  };

  return (
    <DialogContent className="sm:max-w-5xl">
      <DialogHeader>
        <DialogTitle>Masa Adı: {title.toLocaleUpperCase("tr")}</DialogTitle>
        <DialogDescription>Garson: {order.waiter}</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 md:grid-cols-[18rem_1fr_16rem]">
        <section aria-label="Parçalı öde" className="flex min-h-0 flex-col gap-2">
          <h3 className="text-xs font-bold tracking-wide uppercase">Parçalı öde</h3>
          <ul className="grid max-h-72 gap-1.5 overflow-y-auto">
            {order.lines.map((line) => {
              const settled = isLineSettled(order, line.id);
              const selectable = !line.isComplimentary && !settled;
              return (
                <li key={line.id} className={cn("flex items-center gap-2 rounded-md border p-2 text-xs", !selectable && "opacity-60")}>
                  <Checkbox
                    aria-label={`${line.name} seç`}
                    disabled={!selectable}
                    checked={selectedLineIds.includes(line.id)}
                    onCheckedChange={() => toggleLine(line.id)}
                  />
                  <span className="flex-1">
                    {line.quantity} × {line.name}
                  </span>
                  {settled && <Badge variant="success">Ödendi</Badge>}
                  {line.isComplimentary && <Badge variant="warning">İkram</Badge>}
                  <span className="font-semibold">{formatKurus(lineTotal(line))}</span>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-label="Tutar" className="flex flex-col gap-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Toplam</dt>
            <dd className="text-right font-semibold">{formatKurus(orderTotal(order))}</dd>
            <dt className="text-muted-foreground">Ödenen</dt>
            <dd className="text-right font-semibold">{formatKurus(paidTotal(order))}</dd>
            <dt className="text-muted-foreground">Kalan</dt>
            <dd className="text-right font-semibold">{formatKurus(due)}</dd>
          </dl>
          <p className="py-2 text-center text-lg font-bold" aria-live="polite">
            Ödenecek Tutar: {formatKurus(amountToPay)}
          </p>
          <Numpad onKey={handleKey} />
          <div className="flex items-center justify-center gap-2 text-sm">
            <span>Kişi sayısı</span>
            <Button type="button" variant="outline" size="icon-sm" aria-label="Kişi sayısını azalt" onClick={() => setPeople((n) => Math.max(2, n - 1))}>
              −
            </Button>
            <span aria-label="Kişi sayısı" className="w-6 text-center font-semibold">
              {people}
            </span>
            <Button type="button" variant="outline" size="icon-sm" aria-label="Kişi sayısını arttır" onClick={() => setPeople((n) => n + 1)}>
              +
            </Button>
          </div>
        </section>

        <section aria-label="Ödeme tipleri" className="flex flex-col gap-3">
          <h3 className="text-xs font-bold tracking-wide uppercase">Ödeme tipleri</h3>
          {due === 0 ? (
            <Button type="button" size="xl" onClick={closeWithoutPayment}>
              Siparişi Kapat
            </Button>
          ) : accountCustomers ? (
            <div role="group" aria-label="Veresiye müşterisi" className="grid gap-3 rounded-lg border bg-muted/40 p-3">
              <p className="text-sm font-semibold">Tutar kimin hesabına yazılsın?</p>
              <Select
                items={[{ value: "none", label: "Müşteri seçmeden (Ödenmez)" }, ...accountCustomers.map((customer) => ({ value: customer.id, label: `${customer.firstName} ${customer.lastName}` }))]}
                value={accountCustomerId || "none"}
                onValueChange={(value) => setAccountCustomerId(value === "none" ? "" : String(value))}
              >
                <SelectTrigger className="w-full" aria-label="Müşteri">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Müşteri seçmeden (Ödenmez)</SelectItem>
                  {accountCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => setAccountCustomers(null)}>
                  Vazgeç
                </Button>
                <Button type="button" onClick={() => pay("on_account", accountCustomerId || undefined)}>
                  Hesaba Yaz
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = METHOD_ICONS[method];
                return (
                  <Button key={method} type="button" variant="outline" disabled={!canPay} className="h-20 flex-col gap-1.5" onClick={() => chooseMethod(method)}>
                    <Icon className="size-6" />
                    <span className="text-[11px] leading-tight">{PAYMENT_METHOD_LABELS[method]}</span>
                  </Button>
                );
              })}
            </div>
          )}

          {order.payments.length > 0 && (
            <div aria-label="Tahsilat geçmişi" role="group" className="grid gap-1 border-t pt-2 text-xs">
              <h4 className="font-bold uppercase">Tahsilat geçmişi</h4>
              {order.payments.map((payment) => (
                <p key={payment.id} className="flex justify-between">
                  <span>{PAYMENT_METHOD_LABELS[payment.method]}</span>
                  <span className="font-semibold">{formatKurus(payment.amount)}</span>
                </p>
              ))}
            </div>
          )}
        </section>
      </div>
    </DialogContent>
  );
}
