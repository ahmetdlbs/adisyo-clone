"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "./confirm-dialog";

interface RowActionsProps {
  /** What the row is called; used in accessible names and the confirmation ("Öğrenci silinsin mi?"). */
  name: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

/** Edit / delete buttons for a table row. Deleting always asks first, so no screen can delete silently. */
export function RowActions({ name, onEdit, onDelete }: RowActionsProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="flex items-center justify-end gap-1">
      {onEdit && (
        <Button variant="ghost" size="icon-sm" aria-label={`${name} düzenle`} onClick={onEdit}>
          <Pencil />
        </Button>
      )}
      {onDelete && (
        <>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${name} sil`}
            className="text-destructive hover:text-destructive"
            onClick={() => setIsConfirmOpen(true)}
          >
            <Trash2 />
          </Button>
          <ConfirmDialog
            open={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            title={`${name} silinsin mi?`}
            description="Bu işlem geri alınamaz."
            confirmLabel="Sil"
            destructive
            onConfirm={onDelete}
          />
        </>
      )}
    </div>
  );
}
