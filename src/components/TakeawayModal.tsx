"use client";

import React, { useState } from "react";
import { X, Store, Bike, User, Phone } from "lucide-react";

interface TakeawayModalProps {
  type: "takeaway" | "delivery";
  isOpen: boolean;
  onClose: () => void;
  onCreateOrder: (title: string, customerName: string, phone: string) => void;
}

export default function TakeawayModal({
  type,
  isOpen,
  onClose,
  onCreateOrder,
}: TakeawayModalProps) {
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  if (!isOpen) return null;

  const isTakeaway = type === "takeaway";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const title = isTakeaway ? "Gel Al Sipariş" : "Paket Servis";
    onCreateOrder(title, customerName || "Misafir", phone);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-5 z-10 animate-in zoom-in-95 border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {isTakeaway ? (
              <Store className="w-5 h-5 text-[#b5473f]" />
            ) : (
              <Bike className="w-5 h-5 text-[#b5473f]" />
            )}
            <h3 className="font-bold text-base text-[#2b2f36]">
              {isTakeaway ? "Yeni Gel Al Siparişi" : "Yeni Paket Siparişi"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Müşteri Adı
            </label>
            <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg focus-within:border-[#b5473f] focus-within:bg-white">
              <User className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Örn: Can Yılmaz"
                className="w-full pl-9 pr-3 py-2 text-xs text-gray-800 bg-transparent outline-none rounded-lg"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 block mb-1">
              Telefon Numarası
            </label>
            <div className="relative flex items-center bg-gray-50 border border-gray-300 rounded-lg focus-within:border-[#b5473f] focus-within:bg-white">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Örn: 0532 000 00 00"
                className="w-full pl-9 pr-3 py-2 text-xs text-gray-800 bg-transparent outline-none rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#b5473f] hover:bg-[#a13d36] text-white font-bold text-xs rounded-lg shadow-xs transition-colors cursor-pointer mt-2"
          >
            Siparişi Başlat
          </button>
        </form>
      </div>
    </div>
  );
}
