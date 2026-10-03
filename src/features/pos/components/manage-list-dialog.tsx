"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { TextField } from "@/components/kit/form-fields";
import { RowActions } from "@/components/kit/row-actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface NamedItem {
  id: string;
  name: string;
}

interface ManageListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  /** What one item is called: "Bölge" gives the field "Bölge adı". */
  noun: string;
  schema: z.ZodType<{ name: string }, z.ZodTypeDef, { name: string }>;
  items: readonly NamedItem[];
  /** Creates (id null) or renames an item. Throw an Error to reject it; the message is shown on the field. */
  onSave: (input: { id: string | null; name: string }) => Promise<void>;
  /** Throw an Error to refuse; the message is shown as a toast. */
  onDelete: (id: string) => Promise<void>;
  /** When given, each row gets up/down buttons. */
  onMove?: (id: string, offset: -1 | 1) => Promise<void>;
}

/** A small list editor in a dialog: rename, delete and (optionally) reorder named items, with an add/rename form. */
export function ManageListDialog({ open, ...props }: ManageListDialogProps) {
  // Mounted only while open, so it always opens on a clean form.
  return open ? <ManageListBody {...props} /> : null;
}

function ManageListBody({ onOpenChange, title, description, noun, schema, items, onSave, onDelete, onMove }: Omit<ManageListDialogProps, "open">) {
  const [editing, setEditing] = useState<NamedItem | null>(null);

  const run = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "İşlem yapılamadı");
    }
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <ul aria-label={`${noun} listesi`} className="max-h-64 overflow-y-auto">
          {items.length === 0 && <li className="py-4 text-center text-sm text-muted-foreground">Henüz kayıt yok.</li>}
          {items.map((item, index) => (
            <li key={item.id} className="flex items-center gap-1 border-b py-1.5 last:border-b-0">
              <span className="flex-1 text-sm font-medium">{item.name}</span>
              {onMove && (
                <>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`${item.name} yukarı taşı`} disabled={index === 0} onClick={() => run(() => onMove(item.id, -1))}>
                    <ArrowUp />
                  </Button>
                  <Button type="button" variant="ghost" size="icon-sm" aria-label={`${item.name} aşağı taşı`} disabled={index === items.length - 1} onClick={() => run(() => onMove(item.id, 1))}>
                    <ArrowDown />
                  </Button>
                </>
              )}
              <RowActions name={item.name} onEdit={() => setEditing(item)} onDelete={() => run(() => onDelete(item.id))} />
            </li>
          ))}
        </ul>

        <NameForm key={editing?.id ?? "new"} editing={editing} noun={noun} schema={schema} onSave={onSave} onDone={() => setEditing(null)} />
      </DialogContent>
    </Dialog>
  );
}

interface NameFormProps {
  editing: NamedItem | null;
  noun: string;
  schema: ManageListDialogProps["schema"];
  onSave: ManageListDialogProps["onSave"];
  onDone: () => void;
}

function NameForm({ editing, noun, schema, onSave, onDone }: NameFormProps) {
  const form = useForm<{ name: string }>({ resolver: zodResolver(schema), defaultValues: { name: editing?.name ?? "" } });

  const submit = form.handleSubmit(async ({ name }) => {
    try {
      await onSave({ id: editing?.id ?? null, name });
      form.reset({ name: "" });
      onDone();
    } catch (error) {
      form.setError("name", { message: error instanceof Error ? error.message : "Kaydedilemedi" });
    }
  });

  return (
    <form onSubmit={submit} noValidate className="grid gap-3 border-t pt-4">
      <TextField control={form.control} name="name" label={`${noun} adı`} autoFocus />
      <div className="flex justify-end gap-2">
        {editing && (
          <Button type="button" variant="outline" onClick={onDone}>
            Vazgeç
          </Button>
        )}
        <Button type="submit">{editing ? "Güncelle" : "Ekle"}</Button>
      </div>
    </form>
  );
}
