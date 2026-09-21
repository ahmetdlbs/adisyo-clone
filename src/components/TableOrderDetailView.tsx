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

  const itemGroups: { time: string; items: typeof table.items }[] = [];
  table.items.forEach((item) => {
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

  const kdvRate = 0.1;
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
      {/* Top Header Bar */}
      <div className="h-[50px] flex items-stretch shrink-0 z-20">
        {/* Left Header (Dark Charcoal) */}
        <div className="w-[390px] bg-[#32373c] text-white px-3 flex items-center justify-between shrink-0 border-r border-[#262a2e]">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onBack}
              className="p-1.5 hover:bg-white/10 rounded cursor-pointer"
              title="Geri"
            >
              <ArrowLeft className="w-[18px] h-[18px] text-white/90" />
            </button>
            <div className="flex items-center gap-2 pl-1 font-semibold text-[15px]">
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

          {/* Action icons */}
          <div className="flex items-center gap-1.5">
            <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
              <PlusSquare className="w-4 h-4" />
            </button>
            {orderType === "table" && (
              <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
                <Printer className="w-4 h-4" />
              </button>
            )}
            <button type="button" className="p-1.5 text-white/80 hover:text-white cursor-pointer">
              <User className="w-4 h-4" />
            </button>
            {/* MARŞ Button */}
            <button
              type="button"
              onClick={() => alert("1. Marş Bildirimi Gönderildi.")}
              className="ml-1 px-3 py-1 bg-[#40454b] hover:bg-[#4a5057] text-white/90 text-[11px] font-bold rounded-[2px] tracking-wider transition-colors cursor-pointer"
            >
              MARŞ
            </button>
          </div>
        </div>

        {/* Right Header (Light Gray) */}
        <div className="flex-1 bg-[#e6e9ed] flex items-center justify-between px-6 gap-3">
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ürün Adı veya Barkod ile Arama"
              className="w-full h-9 bg-transparent border-none text-[15px] text-[#2b2f36] placeholder-[#8e8e8e] outline-none"
            />
          </div>

          <div className="h-full flex items-center gap-5 text-white/90 shrink-0 bg-[#32373c] px-5 -mr-6">
            <div className="flex items-center gap-1.5 text-sm cursor-pointer hover:text-white">
              <Users className="w-4 h-4" />
              <span>1</span>
            </div>
            <button type="button" className="cursor-pointer hover:text-white">
              <Calendar className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onUpdateTableItems(table.id, [])}
              className="cursor-pointer hover:text-white"
              title="Siparişi Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Split Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: Ticket Adisyon Fişi */}
        <div className="w-[390px] bg-[#f5f6f8] border-r border-[#d8dde4] flex flex-col justify-between overflow-hidden shrink-0">
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Ticket Header */}
            <div className="px-4 py-3 bg-[#f5f6f8]">
              <div className="flex items-center justify-between text-[11px] font-semibold text-[#666]">
                <span>Adisyon: {orderType === "table" ? (table.orderNumber || 461510410) : 0}</span>
                <span className="text-[#388e3c]">
                  Sipariş Durumu: Hazırlanıyor
                </span>
              </div>
              {orderType === "table" && (
                <div className="text-center text-[11px] text-[#777] mt-3">
                  1. Marş hazırlanıyor
                </div>
              )}
            </div>

            {/* Ticket Items List */}
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {itemGroups.map((group) => (
                <div key={group.time}>
                  <div className="text-center text-[10px] text-[#999] py-2">
                    {group.time}
                  </div>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 px-2 flex items-start gap-3 hover:bg-black/5 border-b border-gray-200/60 last:border-b-0"
                    >
                      {/* Qty Box */}
                      <div className="w-8 h-8 rounded-[3px] bg-[#e6e8ec] flex items-center justify-center font-semibold text-sm text-[#333] shrink-0 mt-0.5">
                        {item.quantity}
                      </div>

                      {/* Product Name & Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center pt-0.5">
                        <div className="font-medium text-[13px] text-[#222] truncate">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-[#888] mt-0.5">
                          {item.portion}
                        </div>
                        <div className="text-[11px] text-[#888]">
                          {item.waiter}
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="flex items-start gap-3 shrink-0 pt-0.5">
                        <span className="font-semibold text-[13px] text-[#222]">
                          ₺{(item.price * item.quantity).toFixed(2).replace(".", ",")}
                        </span>

                        <button
                          type="button"
                          className="p-1 -mt-1 text-[#999] hover:text-[#333] cursor-pointer"
                        >
                          <List className="w-[14px] h-[14px]" />
                        </button>

                        <div className="relative">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenItemMenuId(
                                openItemMenuId === item.id ? null : item.id
                              )
                            }
                            className="p-1 -mt-1 text-[#999] hover:text-[#333] cursor-pointer"
                          >
                            <MoreVertical className="w-[14px] h-[14px]" />
                          </button>

                          {openItemMenuId === item.id && (
                            <div className="absolute right-0 top-5 w-36 bg-white border border-gray-200 rounded-[4px] shadow-lg py-1 z-30 text-sm">
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
          </div>

          {/* Ticket Footer (Totals & Buttons) */}
          <div className="bg-[#f5f6f8] shrink-0">
            {/* Expand arrow */}
            <div className="flex justify-end px-3">
              <ChevronUp className="w-5 h-5 text-[#c9302c] cursor-pointer" />
            </div>

            {/* Financial Summary */}
            <div className="px-4 pb-3">
              <div className="flex items-center justify-between font-bold text-[#333] text-[15px]">
                <span>Toplam Tutar</span>
                <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
              </div>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center gap-2 px-3 pb-3">
              <button
                type="button"
                className="w-11 h-11 rounded-[3px] bg-white border border-gray-200 flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:bg-gray-50"
                title="İndirim"
              >
                <Tag className="w-5 h-5 text-[#c9302c]" fill="#c9302c" />
              </button>

              {orderType === "table" ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#43a047] hover:bg-[#388e3c] text-white text-[13px] font-bold rounded-[3px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <span>ÖDE</span>
                    <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
                  </button>

                  <button
                    type="button"
                    onClick={onQuickPay}
                    className="flex-1 h-11 bg-[#fff8e1] hover:bg-[#ffecb3] text-[#f57f17] text-[13px] font-bold rounded-[3px] flex items-center justify-center gap-1.5 cursor-pointer transition-colors border border-[#ffe082] shadow-sm"
                  >
                    <Zap className="w-[14px] h-[14px] fill-current" />
                    <span>HIZLI ÖDE</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert("Sipariş Kaydedildi.");
                      onBack();
                    }}
                    className="px-6 h-11 bg-[#c9302c] hover:bg-[#b52b27] text-white text-[13px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                  >
                    KAYDET
                  </button>
                </>
              ) : orderType === "gel-al" ? (
                <>
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#43a047] hover:bg-[#388e3c] text-white text-[13px] font-bold rounded-[3px] flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <span>ÖDE</span>
                    <span>₺{totalAmount.toFixed(2).replace(".", ",")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { alert("Gel Al Sipariş Kaydedildi."); onBack(); }}
                    className="px-6 h-11 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#b84a43] text-[13px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    KAYDET
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onOpenPayment}
                    className="flex-1 h-11 bg-[#e5e7eb] hover:bg-[#d1d5db] text-[#b84a43] text-[13px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-colors"
                  >
                    ÖDEME TİPİ
                  </button>
                  <button
                    type="button"
                    onClick={() => { alert("Paket Sipariş Kaydedildi."); onBack(); }}
                    className="px-6 h-11 bg-[#c9302c] hover:bg-[#b52b27] text-white text-[13px] font-bold rounded-[3px] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                  >
                    KAYDET
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Menu Categories & Product Cards */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#e6e9ed]">
          {/* Categories Horizontal Tabs */}
          <div className="h-[46px] bg-[#f5f6f8] border-b border-[#d8dde4] flex items-end px-2 overflow-x-auto shrink-0 scrollbar-none">
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
                  className={`px-6 pb-3 text-[12px] font-bold uppercase tracking-wide cursor-pointer transition-all whitespace-nowrap relative ${
                    isActive
                      ? "text-[#c9302c]"
                      : "text-[#333] hover:text-[#c9302c]"
                  }`}
                >
                  {cat.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#c9302c]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Product Cards Grid */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {filteredProducts.map((prod) => {
                const qty = getProductQuantity(prod.name);
                const isSelected = qty > 0;

                return (
                  <div
                    key={prod.id}
                    className="h-[85px] rounded-[3px] bg-[#9ebfd2] flex items-stretch justify-between cursor-pointer overflow-hidden hover:opacity-95 select-none"
                  >
                    {/* Left: Title & Price */}
                    <div
                      className="flex-1 flex flex-col justify-between p-2.5 min-w-0"
                      onClick={() => handleAddItem(prod)}
                    >
                      <span className="font-medium text-[13px] text-[#222] leading-snug truncate whitespace-normal line-clamp-2">
                        {prod.name}
                      </span>
                      <span className="text-[12px] text-[#222]">
                        ₺{prod.price.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    {/* Right: Stepper Widget */}
                    {isSelected && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-[34px] flex flex-col items-stretch shrink-0 bg-white border-l border-[#8ba9bc]"
                      >
                        <button
                          type="button"
                          onClick={() => handleAddItem(prod)}
                          className="flex-1 flex items-center justify-center text-[#c9302c] hover:bg-gray-50 cursor-pointer"
                        >
                          <Plus className="w-[14px] h-[14px]" strokeWidth={2.5} />
                        </button>

                        <div className="h-7 bg-[#c9302c] flex items-center justify-center text-[13px] font-bold text-white shadow-inner">
                          {qty}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDecrementItem(prod.name)}
                          className="flex-1 flex items-center justify-center text-[#c9302c] hover:bg-gray-50 cursor-pointer"
                        >
                          <Minus className="w-[14px] h-[14px]" strokeWidth={2.5} />
                        </button>
                      </div>
                    )}
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
