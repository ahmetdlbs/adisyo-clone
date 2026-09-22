"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FormDialog } from "@/components/kit/form-dialog";
import { TextField } from "@/components/kit/form-fields";
import {
  discountPercentSchema,
  type DiscountPercentInput,
  type DiscountPercentValues,
} from "../model/discount-form";

interface DiscountDialogProps {
  open: boolean;
  /** The percentage currently applied to the order (0 when none). */
  currentPercent: number;
  onOpenChange: (open: boolean) => void;
  onApply: (percent: number) => void;
}

/** Asks for an order-wide discount percentage. Entering 0 removes it. */
export function DiscountDialog({ open, ...props }: DiscountDialogProps) {
  // Mounted only while open, so every opening starts from the order's current discount.
  return open ? <DiscountForm {...props} /> : null;
}

function DiscountForm({ currentPercent, onOpenChange, onApply }: Omit<DiscountDialogProps, "open">) {
  const form = useForm<DiscountPercentInput, unknown, DiscountPercentValues>({
    resolver: zodResolver(discountPercentSchema),
    defaultValues: { percent: currentPercent > 0 ? String(currentPercent) : "" },
  });

  return (
    <FormDialog
      open
      onOpenChange={onOpenChange}
      title="İndirim"
      description="Siparişin tamamına uygulanacak indirim yüzdesini giriniz. İndirimi kaldırmak için 0 giriniz."
      submitLabel="Uygula"
      onSubmit={form.handleSubmit(({ percent }) => onApply(percent))}
    >
      <TextField
        control={form.control}
        name="percent"
        label="İndirim yüzdesi (%)"
        type="number"
        inputMode="decimal"
        min={0}
        max={100}
        step="any"
        autoFocus
      />
    </FormDialog>
  );
}
