"use client";

import type { FormEventHandler, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";

interface FormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  /** Pass `form.handleSubmit(...)` from react-hook-form. */
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}

/** Side-panel form for edits too big for a dialog (lists of sub-items, many fields). Same contract as FormDialog. */
export function FormSheet({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Kaydet",
  cancelLabel = "Vazgeç",
  isSubmitting = false,
  onSubmit,
  children,
}: FormSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 sm:max-w-xl">
        <form onSubmit={onSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <SheetHeader className="border-b pr-12">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            <div className="grid gap-4">{children}</div>
          </div>
          <SheetFooter className="flex-row justify-end border-t">
            <SheetClose render={<Button type="button" variant="outline" />}>{cancelLabel}</SheetClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {submitLabel}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
