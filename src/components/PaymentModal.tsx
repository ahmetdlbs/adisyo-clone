"use client";

import React, { useState } from "react";
import {
  X,
  Save,
  Printer,
  Clock,
} from "lucide-react";
import { TableData } from "@/data/posData";

interface PaymentModalProps {
  table: TableData | null;
  isOpen: boolean;
  onClose: () => void;
  onCompletePayment: (
    tableId: string,
    paidAmount: number,
    paymentType: string,
    isFullPayment: boolean
  ) => void;
}

export default function PaymentModal({
  table,
  isOpen,
  onClose,
  onCompletePayment,
}: PaymentModalProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [calculatorInput, setCalculatorInput] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"methods" | "tip">("methods");

  if (!isOpen || !table) return null;

  const currentTotal = table.items.reduce(
    (acc, item) => acc + (item.isComplimentary ? 0 : item.price * item.quantity),
    0
  );

  const selectedItemsTotal = table.items
    .filter((it) => selectedItems.includes(it.id))
    .reduce((acc, it) => acc + (it.isComplimentary ? 0 : it.price * it.quantity), 0);

  const displayDueAmount = calculatorInput
    ? parseFloat(calculatorInput) || 0
    : selectedItems.length > 0
    ? selectedItemsTotal
    : currentTotal;

  const handleItemToggle = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const handleNumpadClick = (val: string) => {
    if (val === "backspace") {
      setCalculatorInput((prev) => prev.slice(0, -1));
    } else if (val === "all") {
      setCalculatorInput(currentTotal.toString());
      setSelectedItems(table.items.map((i) => i.id));
    } else if (val === "split") {
      const parts = prompt("Kaç kişiye bölünecek?", "2");
      if (parts && parseInt(parts) > 0) {
        setCalculatorInput((currentTotal / parseInt(parts)).toFixed(2));
      }
    } else if (val === "discount") {
      const disc = prompt("İndirim yüzdesi giriniz (%):", "10");
      if (disc) {
        const d = (currentTotal * (parseFloat(disc) || 0)) / 100;
        setCalculatorInput(Math.max(0, currentTotal - d).toFixed(2));
      }
    } else {
      setCalculatorInput((prev) => prev + val);
    }
  };

  const handleProcessPayment = (methodName: string) => {
    const isFull = displayDueAmount >= currentTotal;
    onCompletePayment(table.id, displayDueAmount, methodName, isFull);
    onClose();
  };

  const numpadKeys = [
    { val: "7", label: "7" },
    { val: "8", label: "8" },
    { val: "9", label: "9" },
    { val: "all", label: "Tüm" },
    { val: "4", label: "4" },
    { val: "5", label: "5" },
    { val: "6", label: "6" },
    { val: "split", label: "1/n" },
    { val: "1", label: "1" },
    { val: "2", label: "2" },
    { val: "3", label: "3" },
    { val: "discount", label: "İndirim" },
    { val: ".", label: "." },
    { val: "0", label: "0" },
    { val: "backspace", label: "←" },
    { val: "", label: "" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-[1100px] bg-white rounded-[6px] shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden border border-[#d8dde4]">

        {/* ── Top Header ── */}
        <div className="bg-white border-b border-[#e5e7eb] px-5 py-3 flex items-center justify-between shrink-0">
          <div>
            <div className="font-semibold text-sm text-[#111827]">
              Masa Adı: {table.name.toUpperCase()}
            </div>
            <div className="text-xs text-[#6b7280]">
              Garson: {table.waiter || "Ahmet"}
            </div>
          </div>

          {/* Red action links — matching live Adisyo */}
          <div className="flex items-center gap-5 text-xs font-semibold text-[#b84a43]">
            <button
              type="button"
              onClick={() => { alert("Kaydedildi."); onClose(); }}
              className="flex items-center gap-1.5 hover:opacity-75 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Kaydet</span>
            </button>

            <button
              type="button"
              onClick={() => handleProcessPayment("Kredi Kartı")}
              className="flex items-center gap-1.5 hover:opacity-75 cursor-pointer"
            >
              <svg width="14" height="11" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="20" height="14" rx="2"/>
                <line x1="1" y1="6" x2="21" y2="6"/>
              </svg>
              <span>Öde ve Kapat</span>
            </button>

            <button
              type="button"
              onClick={() => { alert("Fiş yazdırıldı."); handleProcessPayment("Nakit"); }}
              className="flex items-center gap-1.5 hover:opacity-75 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Öde ve Yazdır</span>
            </button>

            <button
              type="button"
              onClick={() => { alert("Fiş yazdırıldı ve ödendi."); handleProcessPayment("Kredi Kartı"); }}
              className="flex items-center gap-1.5 hover:opacity-75 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Öde, Yazdır ve Kapat</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 hover:opacity-75 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Ödeme Ekranını Kapat</span>
            </button>
          </div>
        </div>

        {/* ── 3-Column Body ── */}
        <div className="flex flex-1 overflow-hidden divide-x divide-[#e5e7eb]">

          {/* ─── Col 1: PARÇALI ÖDE ─── */}
          <div className="w-[300px] flex flex-col shrink-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb]">
              <span className="font-bold text-xs uppercase tracking-wide text-[#111827]">PARÇALI ÖDE</span>
              <span className="text-xs font-bold text-[#111827]">
                ₺{selectedItemsTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="px-4 py-2.5">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-[#f0f2f5] text-[#374151] rounded-full">
                Ödenmemiş Olanlar
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 space-y-1.5 pb-2">
              {table.items.map((item) => {
                const isChecked = selectedItems.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => handleItemToggle(item.id)}
                    className={`p-2.5 rounded-[4px] border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? "bg-blue-50 border-blue-300"
                        : "bg-white border-[#e5e7eb] hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#111827]">
                        {item.quantity} - (Tam) {item.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#111827]">
                          ₺{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isChecked ? "#b84a43" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
                          <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
                          <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
                          <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
                        </svg>
                      </div>
                    </div>
                    <div className="text-[10px] text-[#6b7280] mt-0.5">
                      Ödenen: ₺0,00 &nbsp;·&nbsp; Kalan: ₺{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="px-3 pb-3 pt-2 border-t border-[#e5e7eb] flex gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleNumpadClick("split")}
                className="flex-1 py-2 border border-[#fecaca] text-[#b84a43] hover:bg-red-50 text-xs font-semibold rounded-[4px] cursor-pointer"
              >
                Ürün Bazlı 1/n
              </button>
              <button
                type="button"
                onClick={() => handleNumpadClick("discount")}
                className="flex-1 py-2 border border-[#fecaca] text-[#b84a43] hover:bg-red-50 text-xs font-semibold rounded-[4px] cursor-pointer"
              >
                Ürün Bazlı İndirim
              </button>
            </div>
          </div>

          {/* ─── Col 2: TOPLAM + Numpad ─── */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e5e7eb] shrink-0">
              <span className="font-bold text-xs uppercase tracking-wide text-[#111827]">TOPLAM</span>
              <button type="button" className="flex items-center gap-1 text-[#b84a43] hover:opacity-75 cursor-pointer">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[11px] font-semibold">TAHSİLAT GEÇMİŞİ</span>
              </button>
              <span className="font-bold text-xs text-[#111827]">
                ₺{currentTotal.toFixed(2).replace(".", ",")}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between p-4">
              <div className="flex-1 flex items-center justify-center">
                <span className="text-sm font-bold text-[#111827]">
                  Ödenecek Tutar: ₺{displayDueAmount.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {/* Numpad 4×4 */}
              <div className="grid grid-cols-4 gap-2">
                {numpadKeys.map((key, i) =>
                  key.val === "" ? (
                    <div key={i} className="h-12" />
                  ) : (
                    <button
                      key={key.val + i}
                      type="button"
                      onClick={() => handleNumpadClick(key.val)}
                      className="h-12 bg-white border border-[#e5e7eb] rounded-[4px] text-sm font-semibold hover:bg-gray-50 cursor-pointer flex items-center justify-center"
                    >
                      {key.label}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* ─── Col 3: Ödeme Tipleri ─── */}
          <div className="w-[280px] flex flex-col shrink-0">
            {/* Tabs */}
            <div className="flex items-center gap-5 px-4 border-b border-[#e5e7eb] shrink-0" style={{ height: 45 }}>
              <button
                type="button"
                onClick={() => setActiveTab("methods")}
                className={`text-xs font-semibold cursor-pointer h-full flex items-center border-b-2 transition-colors ${
                  activeTab === "methods"
                    ? "text-[#111827] border-[#b84a43]"
                    : "text-[#6b7280] border-transparent"
                }`}
              >
                Ödeme Tipleri
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("tip")}
                className={`text-xs font-semibold cursor-pointer h-full flex items-center border-b-2 transition-colors ${
                  activeTab === "tip"
                    ? "text-[#111827] border-[#b84a43]"
                    : "text-[#6b7280] border-transparent"
                }`}
              >
                Bahşiş ekle
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              <div className="grid grid-cols-2 gap-2">
                {/* Nakit */}
                <PayMethodBtn label="Nakit" onClick={() => handleProcessPayment("Nakit")}>
                  <div style={{ width: 40, height: 26, borderRadius: 3, background: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontWeight: 800, fontSize: 12 }}>NAKIT</span>
                  </div>
                </PayMethodBtn>

                {/* Kredi Kartı */}
                <PayMethodBtn label="Kredi Kartı" onClick={() => handleProcessPayment("Kredi Kartı")}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#eb001b" }} />
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f79e1b", marginLeft: -8, opacity: 0.95 }} />
                  </div>
                </PayMethodBtn>

                {/* Multinet */}
                <PayMethodBtn label="Multinet" onClick={() => handleProcessPayment("Multinet")}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: "#4caf50", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "white", fontWeight: 900, fontSize: 20 }}>M</span>
                  </div>
                </PayMethodBtn>

                {/* Smart Ticket */}
                <PayMethodBtn label="Smart Ticket" onClick={() => handleProcessPayment("Smart Ticket")}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, border: "2px solid #dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: "#dc2626", fontWeight: 800, fontSize: 8, textAlign: "center", lineHeight: 1.2 }}>Smart<br/>Ticket</span>
                  </div>
                </PayMethodBtn>

                {/* SetCard */}
                <PayMethodBtn label="SetCard" onClick={() => handleProcessPayment("SetCard")}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                    <span style={{ fontWeight: 800, fontSize: 10, color: "#1e40af", letterSpacing: -0.3 }}>SETCARD</span>
                    <div style={{ display: "flex", gap: 2 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#eab308", display: "inline-block" }} />
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#dc2626", display: "inline-block" }} />
                    </div>
                  </div>
                </PayMethodBtn>

                {/* Pluxee (Sodexo) */}
                <PayMethodBtn label="Pluxee (Sodexo)" onClick={() => handleProcessPayment("Pluxee (Sodexo)")}>
                  <span style={{ fontWeight: 900, fontSize: 12, color: "#2563eb", fontStyle: "italic" }}>sodexo</span>
                </PayMethodBtn>

                {/* Diğer */}
                <PayMethodBtn label="Diğer" onClick={() => handleProcessPayment("Diğer")}>
                  <span style={{ fontSize: 18, color: "#9ca3af", fontWeight: 900, letterSpacing: 3 }}>•••</span>
                </PayMethodBtn>

                {/* Ödenmez */}
                <PayMethodBtn label="Ödenmez" onClick={() => handleProcessPayment("Ödenmez")}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", border: "2px solid #6b7280", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                </PayMethodBtn>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function PayMethodBtn({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-[90px] bg-white border border-[#e5e7eb] rounded-[6px] hover:border-gray-400 hover:shadow-sm flex flex-col items-center justify-center gap-2 cursor-pointer transition-all"
    >
      {children}
      <span className="text-[11px] font-medium text-[#111827] text-center leading-tight px-1">
        {label}
      </span>
    </button>
  );
}
