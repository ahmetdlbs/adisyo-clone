import type { VatDefinition } from "../model/vat";

export const INITIAL_VAT_DEFINITIONS: readonly VatDefinition[] = [
  { id: "1", name: "İçecek", rate: 10, isDefault: false },
  { id: "2", name: "Yiyecek", rate: 10, isDefault: true },
];
