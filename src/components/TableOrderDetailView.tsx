"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Edit2,
  PlusSquare,
  Printer,
  User,
  Users,
  Calendar,
  RotateCcw,
  Search,
  MoreVertical,
  ChevronUp,
  Tag,
  Zap,
  Plus,
  Minus,
  List,
  Gift,
  Trash2,
} from "lucide-react";
import { TableData, ProductItem, OrderItem } from "@/data/posData";

interface TableOrderDetailViewProps {
  table: TableData;
  products: ProductItem[];
  orderType?: "table" | "gel-al" | "paket";
  onBack: () => void;
  onUpdateTableItems: (tableId: string, items: OrderItem[]) => void;
  onOpenPayment: () => void;
  onQuickPay: () => void;
}

export default function TableOrderDetailView({
  table,
  products,
  orderType = "table",
  onBack,
  onUpdateTableItems,
  onOpenPayment,
  onQuickPay,
}: TableOrderDetailViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<
    "favori" | "icecekler" | "milkshake" | "tatli" | "yiyecekler"
  >("favori");
  const [searchQuery, setSearchQuery] = useState("");
  const [openItemMenuId, setOpenItemMenuId] = useState<string | null>(null);

  const filteredProducts = products.filter((prod) => {
    if (searchQuery.trim()) {
      return prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return prod.category === selectedCategory;
  });

  const totalAmount = table.items.reduce(
    (acc, it) => acc + (it.isComplimentary ? 0 : it.price * it.quantity),
    0
  );

  // Group items by their time (simulate time-grouped ticket like live Adisyo)
  const itemGroups: { time: string; items: typeof table.items }[] = [];
  table.items.forEach((item) => {
    // Use item index to create two groups (first half earlier, second half later)
    const idx = table.items.indexOf(item);
    const half = Math.ceil(table.items.length / 2);
    const time = idx < half ? "20:03" : "16:36";
    const existing = itemGroups.find((g) => g.time === time);
    if (existing) {
      existing.items.push(item);
    } else {
      itemGroups.push({ time, items: [item] });
    }
  });

  const kdvRate = 0.1; // %10 KDV
  const brutTutar = totalAmount / (1 + kdvRate);
  const kdv = totalAmount - brutTutar;
  const indirimTutari = 0;
  const tahsilEdilen = 0;

  const handleAddItem = (prod: ProductItem) => {
    const existingIndex = table.items.findIndex(
      (it) => it.name === prod.name && !it.isComplimentary
    );

    let updatedItems: OrderItem[];
    if (existingIndex > -1) {
      updatedItems = table.items.map((it, idx) =>
        idx === existingIndex ? { ...it, quantity: it.quantity + 1 } : it
      );
    } else {
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        name: prod.name,
        portion: "tam",
        waiter: table.waiter || "ahmet",
        price: prod.price,
        quantity: 1,
      };
      updatedItems = [...table.items, newItem];
    }
    onUpdateTableItems(table.id, updatedItems);
  };

  const handleDecrementItem = (prodName: string) => {
    const existingIndex = table.items.findIndex(
      (it) => it.name === prodName && !it.isComplimentary
    );
    if (existingIndex === -1) return;

    const currentItem = table.items[existingIndex];
    let updatedItems: OrderItem[];
    if (currentItem.quantity > 1) {
      updatedItems = table.items.map((it, idx) =>
        idx === existingIndex ? { ...it, quantity: it.quantity - 1 } : it
      );
    } else {
      updatedItems = table.items.filter((_, idx) => idx !== existingIndex);
    }
    onUpdateTableItems(table.id, updatedItems);
  };

  const getProductQuantity = (prodName: string) => {
    const it = table.items.find(
      (item) => item.name === prodName && !item.isComplimentary
    );
    return it ? it.quantity : 0;
  };

  const handleRemoveItem = (itemId: string) => {
    const updated = table.items.filter((it) => it.id !== itemId);
    onUpdateTableItems(table.id, updated);
    setOpenItemMenuId(null);
  };

  const handleToggleComplimentary = (itemId: string) => {
    const updated = table.items.map((it) =>
      it.id === itemId ? { ...it, isComplimentary: !it.isComplimentary } : it
    );
    onUpdateTableItems(table.id, updated);
    setOpenItemMenuId(null);
  };

  return (
    <div className="flex-1 flex flex-col h-screen w-screen overflow-hidden select-none bg-[#edf0f5]">
      {/* Top Header Bar: Split 1:1 with panels */}
      <div className="h-[50px] flex items-stretch shrink-0 z-20">
        {/* Left Header (Dark Charcoal #32373c) - 390px matching live Adisyo */}
        <div className="w-[390px] bg-[#32373c] text-white px-3 flex items-center justify-between gap-1.5 shrink-0 border-r border-[#262a2e]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="p-1 hover:bg-white/10 rounded cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-1.5 font-semibold text-[15px]">
              <span>
                {orderType === "gel-al"
                  ? "Gel Al Sipariş"
                  : orderType === "paket"
                  ? "Paket Sipariş"
                  : table.name}
              </span>
              {orderType === "table" && (
                <button
                  type="button"
                  className="text-white/60 hover:text-white p-0.5 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="h-4 w-px bg-white/20" />

          {/* Action icons */}
          <div className="flex items-center gap-2">
            <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
              <PlusSquare className="w-[18px] h-[18px]" />
            </button>
            {orderType === "table" && (
              <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
                <Printer className="w-[18px] h-[18px]" />
              </button>
            )}
            <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
              <User className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* MARŞ Button */}
          <button
            type="button"
            onClick={() => alert("1. Marş Bildirimi Gönderildi.")}
            className="px-3 py-1.5 bg-[#1e2225] hover:bg-black text-white text-xs font-bold rounded-[3px] tracking-wider transition-colors cursor-pointer"
          >
            MARŞ
          </button>
        </div>

        {/* Right Header (Light Gray #e6e9ed) */}
        <div className="flex-1 bg-[#e6e9ed] flex items-center justify-between px-4 gap-3 border-b border-[#d8dde4]">
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün Adı veya Barkod ile Arama"
              className="w-full h-9 px-4 bg-white border border-[#d8dde4] rounded-[3px] text-sm text-[#2b2f36] placeholder-[#8e8e8e] outline-none"
            />
          </div>

          {/* Right Dark Icon Container (#32373c) */}
          <div className="bg-[#32373c] text-white h-9 px-4 rounded-[3px] flex items-center gap-4 shrink-0">
            <div className="flex items-center gap-1.5 text-sm">
              <Users className="w-4 h-4" />
              <span>1</span>
            </div>
            <button type="button" className="hover:text-white cursor-pointer">
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateTableItems(table.id, [])}
              className="hover:text-white cursor-pointer"
              title="Siparişi Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Ticket Adisyon Fişi (390px — matching live Adisyo) */}
        <div className="w-[390px] bg-white border-r border-[#d8dde4] flex flex-col justify-between overflow-hidden shrink-0">
          {/* Ticket Header */}
          <div className="px-4 py-2.5 border-b border-[#eef1f6]">
            <div className="flex items-center justify-between text-[13px] text-[#555]">
              <span>Adisyon: {orderType === "table" ? (table.orderNumber || 461510410) : 0}</span>
              <span className="text-[#388e3c] font-semibold">
                Sipariş Durumu: Hazırlanıyor
              </span>
            </div>
            {orderType === "table" && (
              <>
                <div className="text-center text-[12px] text-[#777] mt-1">
                  1. Marş hazırlanıyor
                </div>
              </>
            )}
          </div>

          {/* Ticket Items List — grouped by time like live Adisyo */}
          <div className="flex-1 overflow-y-auto">
            {itemGroups.map((group) => (
              <div key={group.time}>
                {/* Time separator */}
                <div className="text-center text-[12px] text-[#999] py-2">
                  {group.time}
                </div>
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="py-3 px-3 flex items-center justify-between gap-2 hover:bg-gray-50 border-b border-[#f0f2f5] last:border-b-0"
                  >
                    {/* Left: Quantity square */}
                    <div className="w-8 h-8 rounded-[4px] bg-[#f0f2f5] flex items-center justify-center font-bold text-sm text-[#333] shrink-0">
                      {item.quantity}
                    </div>

                    {/* Middle: Product Name & Waiter */}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[#222] truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-[#888]">
                        {item.portion}
                      </div>
                      <div className="text-xs text-[#888]">
                        {item.waiter}
                      </div>
                    </div>

                    {/* Right: Price & Icons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-sm text-[#222]">
                        ₺{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </span>

                      <button
                        type="button"
                        className="p-1 text-[#888] hover:text-[#333] cursor-pointer"
                      >
                        <List className="w-4 h-4" />
                      </button>

                      {/* 3-dots */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenItemMenuId(
                              openItemMenuId === item.id ? null : item.id
                            )
                          }
                          className="p-1 text-[#888] hover:text-[#333] cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {openItemMenuId === item.id && (
                          <div className="absolute right-0 top-6 w-36 bg-white border border-gray-200 rounded-[4px] shadow-lg py-1 z-30 text-sm">
                            <button
                              type="button"
                              onClick={() => handleToggleComplimentary(item.id)}
                              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer text-amber-800"
                            >
                              <Gift className="w-4 h-4" />
                              <span>{item.isComplimentary ? "İkramı Kaldır" : "İkram"}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.id)}
                              className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 cursor-pointer text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Sil</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Ticket Footer — exact match to live Adisyo */}
          <div className="border-t border-[#d8dde4] bg-white shrink-0">
            {/* Red expand arrow — pointing down like live Adisyo */}
            <div className="flex justify-end px-4 pt-2">
              <ChevronUp className="w-5 h-5 text-[#b84a43] cursor-pointer rotate-180" />
            </div>

            {/* Financial Summary Rows */}
            <div className="px-4 pb-2 space-y-1 text-[13px]">
              <div className="flex items-center justify-between text-[#555]">
                <span>Ara Toplam</span>
                <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between text-[#555]">
                <span>İndirim Tutarı</span>
                <span>₺{indirimTutari.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between font-bold text-[#222] text-sm">
                <span>Toplam Tutar</span>
                <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between text-[#555]">
                <span>Brüt Tutar</span>
                <span>₺{brutTutar.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between text-[#555]">
                <span>KDV</span>
                <span>₺{kdv.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex items-center justify-between text-[#555]">
                <span>Tahsil Edilen</span>
                <span>₺{tahsilEdilen.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-2 px-3 pb-3">
              {/* Tag Button */}
              <button
                type="button"
                className="w-11 h-11 rounded-[4px] bg-white border border-[#d8dde4] text-[#b84a43] flex items-center justify-center shrink-0 cursor-pointer hover:bg-gray-50"
                title="İndirim"
              >
                <Tag className="w-5 h-5 text-[#c9302c]" />
              </button>

              {orderType === "table" ? (
                <>
                  {/* ÖDE Button (Green) */}
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#388e3c] hover:bg-[#2e7d32] text-white text-sm font-bold rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>ÖDE</span>
                    <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
                  </button>

                  {/* HIZLI ÖDE Button (Yellow) */}
                  <button
                    type="button"
                    onClick={onQuickPay}
                    className="px-4 h-11 bg-[#fef3c7] hover:bg-[#fde68a] text-[#b45309] text-sm font-bold rounded-[4px] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
                    <span>HIZLI ÖDE</span>
                  </button>

                  {/* KAYDET Button (Red) */}
                  <button
                    type="button"
                    onClick={() => {
                      alert("Sipariş Kaydedildi.");
                      onBack();
                    }}
                    className="px-5 h-11 bg-[#b84a43] hover:bg-[#a53f38] text-white text-sm font-bold rounded-[4px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    KAYDET
                  </button>
                </>
              ) : orderType === "gel-al" ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#388e3c] hover:bg-[#2e7d32] text-white text-sm font-bold rounded-[4px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>ÖDE</span>
                    <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { alert("Gel Al Sipariş Kaydedildi."); onBack(); }}
                    className="px-6 h-11 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#b84a43] text-sm font-bold rounded-[4px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    KAYDET
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#b84a43] text-sm font-bold rounded-[4px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ÖDEME TİPİ
                  </button>
                  <button
                    type="button"
                    onClick={() => { alert("Paket Sipariş Kaydedildi."); onBack(); }}
                    className="px-6 h-11 bg-[#b84a43] hover:bg-[#a53f38] text-white text-sm font-bold rounded-[4px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    KAYDET
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Menu Categories & Product Cards Grid */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#edf0f5]">
          {/* Categories Horizontal Tabs */}
          <div className="h-[44px] bg-white border-b border-[#d8dde4] px-6 flex items-center gap-8 overflow-x-auto shrink-0 scrollbar-none">
            {[
              { id: "favori", label: "FAVORİ ÜRÜNLER" },
              { id: "icecekler", label: "İÇECEKLER" },
              { id: "milkshake", label: "MİLKSHAKE" },
              { id: "tatli", label: "TATLI VE PASTALAR" },
              { id: "yiyecekler", label: "YİYECEKLER" },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id && !searchQuery;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setSearchQuery("");
                  }}
                  className={`h-full flex items-center text-[13px] font-semibold uppercase tracking-wide cursor-pointer transition-all whitespace-nowrap relative ${
                    isActive
                      ? "text-[#b84a43] border-b-2 border-[#b84a43]"
                      : "text-[#555] hover:text-black"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredProducts.map((prod) => {
                const qty = getProductQuantity(prod.name);
                const isSelected = qty > 0;

                return (
                  <div
                    key={prod.id}
                    onClick={() => handleAddItem(prod)}
                    className="h-[130px] rounded-[8px] bg-[#a8c5da] p-3 flex items-center justify-between cursor-pointer shadow-sm hover:opacity-95 transition-all select-none"
                  >
                    {/* Left: Title & Price */}
                    <div className="flex-1 h-full flex flex-col justify-between pr-2">
                      <span className="font-semibold text-sm text-black leading-tight">
                        {prod.name}
                      </span>
                      <span className="text-sm font-bold text-black">
                        ₺{prod.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    {/* Right: Stepper Widget */}
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-full rounded-[4px] bg-white flex flex-col items-center justify-between py-1 shrink-0 shadow-sm border border-white/60"
                    >
                      <button
                        type="button"
                        onClick={() => handleAddItem(prod)}
                        className="w-full flex-1 flex items-center justify-center text-[#333] hover:text-green-700 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      <div
                        className={`w-6 h-6 rounded-[2px] flex items-center justify-center text-sm font-bold ${
                          isSelected ? "bg-[#b84a43] text-white" : "text-[#777]"
                        }`}
                      >
                        {qty}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDecrementItem(prod.name)}
                        disabled={qty === 0}
                        className="w-full flex-1 flex items-center justify-center text-[#333] hover:text-red-700 disabled:opacity-20 cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
