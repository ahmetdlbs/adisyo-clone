import { Receipt } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia } from "@/components/ui/empty";
import { Progress } from "@/components/ui/progress";
import { formatKurus } from "@/lib/money";
import { PAYMENT_METHOD_LABELS } from "../model/order";
import type { MethodSales } from "../model/stats";

/** What each payment method took today, with its share of the whole. */
export function PaymentBreakdown({ methods }: { methods: readonly MethodSales[] }) {
  if (methods.length === 0) {
    return (
      <Empty className="h-40">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Receipt />
          </EmptyMedia>
          <EmptyDescription>Henüz tamamlanan tahsilat bulunmuyor</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul aria-label="Ödeme yöntemleri" className="flex flex-col gap-4">
      {methods.map(({ method, amount, share }) => {
        const label = PAYMENT_METHOD_LABELS[method];
        return (
          <li key={method} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="text-foreground">{label}</span>
              <span className="tabular-nums">
                <span className="font-medium text-foreground">{formatKurus(amount)}</span>
                <span className="ml-2 text-xs text-muted-foreground">%{share}</span>
              </span>
            </div>
            <Progress value={share} aria-label={`${label} payı`} />
          </li>
        );
      })}
    </ul>
  );
}
