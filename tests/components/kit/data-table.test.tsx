import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DataTable, type DataTableColumn } from "@/components/kit/data-table";

interface Discount {
  id: string;
  name: string;
  amount: number;
}

const COLUMNS: readonly DataTableColumn<Discount>[] = [
  { id: "name", header: "İndirim Adı", cell: (row) => row.name },
  { id: "amount", header: "Tutar", cell: (row) => row.amount, align: "right" },
];

const ROWS: readonly Discount[] = [
  { id: "1", name: "Öğrenci", amount: 10 },
  { id: "2", name: "Personel", amount: 20 },
];

function setup(props: Partial<React.ComponentProps<typeof DataTable<Discount>>> = {}) {
  return render(<DataTable columns={COLUMNS} rows={ROWS} getRowId={(row) => row.id} {...props} />);
}

describe("DataTable", () => {
  it("renders a header per column", () => {
    setup();

    expect(screen.getAllByRole("columnheader").map((header) => header.textContent)).toEqual(["İndirim Adı", "Tutar"]);
  });

  it("renders a row per item with each column's cell", () => {
    setup();

    expect(screen.getAllByRole("row")).toHaveLength(ROWS.length + 1); // + header row
    expect(screen.getByRole("cell", { name: "Öğrenci" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "20" })).toBeInTheDocument();
  });

  it("shows the default empty message across all columns when there are no rows", () => {
    setup({ rows: [] });

    const cell = screen.getByRole("cell", { name: "Kayıt bulunamadı." });
    expect(cell).toHaveAttribute("colspan", String(COLUMNS.length));
  });

  it("shows a custom empty message", () => {
    setup({ rows: [], emptyMessage: "Hiç indirim kaydı bulunamadı." });

    expect(screen.getByText("Hiç indirim kaydı bulunamadı.")).toBeInTheDocument();
  });

  it("names the table for assistive tech through the caption", () => {
    setup({ caption: "İndirimler" });

    expect(screen.getByRole("table", { name: "İndirimler" })).toBeInTheDocument();
  });

  it("aligns cells by the column's align option", () => {
    setup();

    expect(screen.getByRole("cell", { name: "10" })).toHaveClass("text-right");
    expect(screen.getByRole("cell", { name: "Öğrenci" })).toHaveClass("text-left");
  });

  it("renders custom cell content", () => {
    setup({
      columns: [{ id: "amount", header: "Oran", cell: (row) => <strong>%{row.amount}</strong> }],
    });

    expect(screen.getByText("%10")).toBeInTheDocument();
  });
});
