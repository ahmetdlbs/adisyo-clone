"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { buildStockCount, type StockCountLine, type StockItem } from "../model/stock-item";

interface StockCountDialogProps {
  open: boolean;
  items: readonly StockItem[];
  onOpenChange: (open: boolean) => void;
  /** Throw an Error to reject the count; its message is shown under the sheet. */
  onSave: (lines: StockCountLine[]) => Promise<void>;
}

/** Mount with a new `key` per opening so the sheet always starts blank. */
export function StockCountDialog({ open, items, onOpenChange, onSave }: StockCountDialogProps) {
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const result = buildStockCount(items, entries);
    if (!result.ok) {
      setMessage(result.message);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(result.lines);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sayım kaydedilemedi");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <form onSubmit={submit} noValidate className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Stok Sayımı</DialogTitle>
            <DialogDescription>Rafta saydığınız miktarı yazın; boş bıraktığınız kartlar değişmez. Kaydedince sistemdeki miktar sayımla değiştirilir.</DialogDescription>
          </DialogHeader>
          <ul className="grid max-h-[50vh] gap-2 overflow-auto pr-1">
            {items.map((item) => (
              <li key={item.id} className="grid grid-cols-[1fr_8rem] items-center gap-3">
                <label htmlFor={`count-${item.id}`} className="text-sm">
                  {item.name}
                  <span className="block text-xs text-muted-foreground">
                    Sistemde: {item.quantity} {item.unitName}
                  </span>
                </label>
                <Input
                  id={`count-${item.id}`}
                  inputMode="decimal"
                  placeholder={item.unitName}
                  value={entries[item.id] ?? ""}
                  onChange={(event) => {
                    setEntries((current) => ({ ...current, [item.id]: event.target.value }));
                    setMessage(null);
                  }}
                />
              </li>
            ))}
          </ul>
          {message && (
            <p role="alert" className="text-sm text-destructive">
              {message}
            </p>
          )}
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Vazgeç</DialogClose>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Spinner />}
              Sayımı Kaydet
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
