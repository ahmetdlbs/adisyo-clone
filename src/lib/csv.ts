/** Turkish Excel opens `;`-separated files, and needs the BOM to read UTF-8 (ğ, ş, İ) correctly. */
const SEPARATOR = ";";
const BOM = "﻿";
// A cell starting with one of these is read as a formula by spreadsheets; prefixing a quote keeps it text.
const FORMULA_START = /^[=+\-@\t\r]/;

/** A kuruş amount as a spreadsheet number with a decimal comma, e.g. 1250 -> "12,50". */
export const kurusCell = (amount: number): string => (amount / 100).toFixed(2).replace(".", ",");

export type CsvCell = string | number | boolean | null | undefined;

function escapeCell(cell: CsvCell): string {
  if (cell === null || cell === undefined) return "";
  const raw = typeof cell === "string" && FORMULA_START.test(cell) && Number.isNaN(Number(cell)) ? `'${cell}` : String(cell);
  return /[";\n\r]/.test(raw) ? `"${raw.replaceAll('"', '""')}"` : raw;
}

/** Builds the text of a CSV file: a header row followed by the data rows. */
export function toCsv(headers: readonly string[], rows: readonly (readonly CsvCell[])[]): string {
  return [headers, ...rows].map((row) => row.map(escapeCell).join(SEPARATOR)).join("\r\n");
}

/** Hands the browser a CSV file to save. Client-only. */
export function downloadCsv(filename: string, headers: readonly string[], rows: readonly (readonly CsvCell[])[]): void {
  const blob = new Blob([BOM + toCsv(headers, rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
