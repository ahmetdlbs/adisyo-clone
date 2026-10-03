import { DataTable, type DataTableColumn } from "@/components/kit/data-table";
import { Badge } from "@/components/ui/badge";
import { formatClock } from "@/lib/format";
import { formatKurus } from "@/lib/money";
import { orderTotal, type Order } from "@/features/pos/model/order";

const COLUMNS: readonly DataTableColumn<Order>[] = [
  { id: "number", header: "#Adisyon No", cell: (order) => `#${order.number}` },
  { id: "opened", header: "Açılış Tarihi", cell: (order) => formatClock(order.openedAt) },
  { id: "closed", header: "Kapanış Tarihi", cell: (order) => (order.closedAt ? formatClock(order.closedAt) : "—") },
  {
    id: "status",
    header: "Durum",
    cell: (order) => (order.status === "paid" ? <Badge variant="success">Ödendi</Badge> : <Badge variant="destructive">İptal</Badge>),
  },
  { id: "waiter", header: "Kullanıcı", cell: (order) => order.waiter },
  { id: "amount", header: "Tutar(₺)", align: "right", cell: (order) => formatKurus(orderTotal(order)) },
];

/** Bills that left the floor (paid or cancelled) on the reported day, shared by every report tab that lists them. */
export function ClosedOrdersTable({ orders }: { orders: readonly Order[] }) {
  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <DataTable columns={COLUMNS} rows={orders} getRowId={(order) => order.id} caption="Kapanan adisyonlar" emptyMessage="Bugün kapanan adisyon yok." />
    </div>
  );
}
