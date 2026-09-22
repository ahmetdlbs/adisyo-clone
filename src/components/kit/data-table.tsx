import type { ReactNode } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: readonly DataTableColumn<T>[];
  rows: readonly T[];
  getRowId: (row: T) => string;
  /** Names the table for assistive tech; hidden visually. */
  caption?: string;
  emptyMessage?: string;
}

const ALIGNMENT = { left: "text-left", center: "text-center", right: "text-right" } as const;

/** Typed list table: columns describe how to render a row, so screens never hand-write <table> markup. */
export function DataTable<T>({ columns, rows, getRowId, caption, emptyMessage = "Kayıt bulunamadı." }: DataTableProps<T>) {
  return (
    <Table>
      {caption && <TableCaption className="sr-only">{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.id} className={cn(ALIGNMENT[column.align ?? "left"], column.headerClassName)}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          rows.map((row) => (
            <TableRow key={getRowId(row)}>
              {columns.map((column) => (
                <TableCell key={column.id} className={cn(ALIGNMENT[column.align ?? "left"], column.className)}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
