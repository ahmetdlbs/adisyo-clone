"use client";

import type { FormEventHandler, ReactNode } from "react";
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
import { Spinner } from "@/components/ui/spinner";

interface FormDialogProps {
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

/** Modal form used by every create/edit flow: title, fields, Vazgeç / submit footer. */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  submitLabel = "Kaydet",
  cancelLabel = "Vazgeç",
  isSubmitting = false,
  onSubmit,
  children,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* noValidate: validation messages come from the schema, not the browser's native bubbles. */}
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4">{children}</div>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>{cancelLabel}</DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
