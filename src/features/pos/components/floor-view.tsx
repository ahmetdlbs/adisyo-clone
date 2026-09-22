"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNow } from "../hooks/use-now";
import { formatKurus } from "@/lib/money";
import { elapsedLabel, remaining, type Order } from "../model/order";
import { isTableOccupied, orderForTable, type TableDefinition } from "../model/pos-state";
import { usePosState } from "../store/pos-provider";

interface FloorViewProps {
  onSelectTable: (tableId: string) => void;
  onOpenQuick: (orderId: string) => void;
}

/** The floor plan: one tab per area, one card per table. */
export function FloorView({ onSelectTable, onOpenQuick }: FloorViewProps) {
  const state = usePosState();
  const now = useNow();
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  // Derived, so an area that was deleted elsewhere can never leave the view pointing at nothing.
  const areaId = state.areas.some((area) => area.id === selectedAreaId) ? selectedAreaId : state.areas[0]?.id;
  const tablesOf = (id: string) => state.tables.filter((table) => table.areaId === id);

  if (state.areas.length === 0) {
    return <p className="p-6 text-muted-foreground">Henüz bölge tanımlanmamış. Masa / Bölgeler ekranından ekleyebilirsiniz.</p>;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <Tabs value={areaId} onValueChange={(value) => setSelectedAreaId(String(value))}>
        <TabsList variant="line">
          {state.areas.map((area) => {
            const tables = tablesOf(area.id);
            const occupied = tables.filter((table) => isTableOccupied(state, table.id)).length;
            return (
              <TabsTrigger key={area.id} value={area.id}>
                {area.name}
                <Badge variant="secondary">
                  {occupied}/{tables.length}
                </Badge>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <div className="grid min-h-0 flex-1 grid-cols-2 content-start gap-4 overflow-y-auto pb-8 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
        {(areaId ? tablesOf(areaId) : []).map((table) => (
          <TableCard
            key={table.id}
            table={table}
            order={orderForTable(state, table.id)}
            now={now}
            onSelect={() => onSelectTable(table.id)}
            onOpenQuick={onOpenQuick}
          />
        ))}
      </div>
    </div>
  );
}

interface TableCardProps {
  table: TableDefinition;
  order: Order | undefined;
  now: Date | null;
  onSelect: () => void;
  onOpenQuick: (orderId: string) => void;
}

function TableCard({ table, order, now, onSelect, onOpenQuick }: TableCardProps) {
  const isOccupied = order !== undefined && order.lines.length > 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex h-32 w-full cursor-pointer flex-col rounded-lg border p-3 text-left shadow-2xs transition-all hover:shadow-sm",
          isOccupied ? "justify-between border-primary/30 bg-primary/15" : "items-center justify-center bg-card hover:border-primary",
          table.shape === "circle" && "rounded-3xl"
        )}
      >
        <span className={isOccupied ? "text-base font-bold" : "text-sm font-semibold"}>{table.name}</span>
        {isOccupied && (
          <>
            <span className="text-xs font-semibold text-primary">{order.customerName ?? "Misafir"}</span>
            <span className="self-center text-lg font-bold">{formatKurus(remaining(order))}</span>
            <span className="text-xs font-medium">{now ? elapsedLabel(order.openedAt, now) : ""}</span>
          </>
        )}
      </button>
      {isOccupied && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Hızlı işlemler: ${table.name}`}
          className="absolute top-2 right-2 bg-primary/15 hover:bg-primary/25"
          onClick={() => onOpenQuick(order.id)}
        >
          <MoreVertical />
        </Button>
      )}
    </div>
  );
}
