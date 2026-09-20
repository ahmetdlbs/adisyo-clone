"use client";

import React from "react";
import {
  CreditCard,
  Zap,
  RotateCcw,
  Printer,
  ArrowRightToLine,
  Scan,
  ArrowUpDown,
  Send,
  X,
} from "lucide-react";
import { TableData } from "@/data/posData";

interface TableQuickModalProps {
  table: TableData | null;
  isOpen: boolean;
  onClose: () => void;
  onQuickPay: (table: TableData) => void;
  onPrintBill: (table: TableData) => void;
}

export default function TableQuickModal({
  table,
  isOpen,
  onClose,
  onQuickPay,
  onPrintBill,
}: TableQuickModalProps) {
  if (!isOpen || !table) return null;

  const actions = [
    {
      id: "pay",
      label: "Öde",
      icon: <CreditCard className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        onClose();
        onQuickPay(table);
      },
    },
    {
      id: "fast_pay",
      label: "Hızlı Öde",
      icon: <Zap className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        onClose();
        onQuickPay(table);
      },
    },
    {
      id: "cancel",
      label: "İptal",
      icon: <RotateCcw className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        alert("Sipariş iptal işlemi.");
        onClose();
      },
    },
    {
      id: "print",
      label: "Yazdır",
      icon: <Printer className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        onPrintBill(table);
        onClose();
      },
    },
    {
      id: "change_table",
      label: "Masayı Değiştir",
      icon: <ArrowRightToLine className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        alert("Masayı Değiştir: Hedef masayı seçiniz.");
        onClose();
      },
    },
    {
      id: "merge_tables",
      label: "Masaları Birleştir",
      icon: <Scan className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        alert("Masaları Birleştir işlemi.");
        onClose();
      },
    },
    {
      id: "transfer_order",
      label: "Adisyon Aktar",
      icon: <ArrowUpDown className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        alert("Adisyon Aktar işlemi.");
        onClose();
      },
    },
    {
      id: "mars",
      label: "Marşla",
      icon: <Send className="w-6 h-6 text-[#b84a43]" />,
      onClick: () => {
        alert("Mutfak marşlandı.");
        onClose();
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Box (Matching masa1_quick_operations_modal_1789837393353.png) */}
      <div className="relative w-full max-w-[460px] bg-white rounded-xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-150 border border-gray-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-base text-[#111827]">
              Masa Adı: {table.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Sipariş veya masa ile ilgili hızlı işlemler
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#b84a43] hover:bg-red-50 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3x3 Action Buttons Grid */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          {actions.map((act) => (
            <button
              key={act.id}
              type="button"
              onClick={act.onClick}
              className="h-24 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 p-2 flex flex-col items-center justify-center gap-2 cursor-pointer shadow-2xs transition-all text-center"
            >
              {act.icon}
              <span className="text-xs font-semibold text-gray-800">
                {act.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
