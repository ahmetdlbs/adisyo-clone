"use client";

import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AmountKey } from "../model/amount-input";

export type NumpadAction = AmountKey | "all" | "split" | "discount" | "clear";

interface KeyDefinition {
  action: NumpadAction;
  label: string;
  /** Accessible name when the visible label is only a symbol. */
  name?: string;
}

const KEYS: readonly KeyDefinition[] = [
  { action: "7", label: "7" },
  { action: "8", label: "8" },
  { action: "9", label: "9" },
  { action: "all", label: "Tüm" },
  { action: "4", label: "4" },
  { action: "5", label: "5" },
  { action: "6", label: "6" },
  { action: "split", label: "1/n" },
  { action: "1", label: "1" },
  { action: "2", label: "2" },
  { action: "3", label: "3" },
  { action: "discount", label: "İndirim" },
  { action: ",", label: ",", name: "Virgül" },
  { action: "0", label: "0" },
  { action: "backspace", label: "", name: "Geri sil" },
  { action: "clear", label: "Temizle" },
];

/** The amount keypad of the payment screen: digits, comma, and shortcuts for all / split / discount. */
export function Numpad({ onKey }: { onKey: (action: NumpadAction) => void }) {
  return (
    <div role="group" aria-label="Sayı tuşları" className="grid grid-cols-4 gap-2">
      {KEYS.map(({ action, label, name }) => (
        <Button key={action} type="button" variant="outline" size="xl" aria-label={name} onClick={() => onKey(action)}>
          {action === "backspace" ? <Delete /> : label}
        </Button>
      ))}
    </div>
  );
}
