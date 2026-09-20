"use client";

import React, { useState, useEffect } from "react";
import {
  Menu,
  Gift,
  Users,
  RefreshCw,
  MoreVertical,
  Megaphone,
  Headphones,
  UserCog,
  ArrowLeft,
  ArrowUpDown,
  Layers,
  Eye,
  Settings,
  ShoppingBag,
  Utensils,
  User,
} from "lucide-react";

interface KitchenScreenViewProps {
  onOpenDrawer: () => void;
  onBack: () => void;
}

export default function KitchenScreenView({
  onOpenDrawer,
  onBack,
}: KitchenScreenViewProps) {
  const [timer1, setTimer1] = useState(3359); // 00:55:59 in seconds
  const [timer2, setTimer2] = useState(3460); // 00:57:40 in seconds

  const [ticket1Completed, setTicket1Completed] = useState(false);
  const [ticket2Completed, setTicket2Completed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer1((t) => (t > 0 ? t - 1 : 0));
      setTimer2((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-[#d8dde4] px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 hover:bg-gray-100 rounded-[4px] text-[#2b2f36] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm text-[#2b2f36]">
            Mutfak / Siparişler
          </span>
        </div>

        {/* Right standard POS controls */}
        <div className="flex items-center gap-3 text-xs text-[#4b5563]">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#fde68a] text-amber-900 flex items-center justify-center hover:opacity-90 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-200 text-xs font-semibold text-[#374151] cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Katıl</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <MoreVertical className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-[#4b5563]" />
          </button>

          <div className="h-5 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fee2e2] text-[#b84a43] text-xs font-semibold hover:bg-[#fecaca] cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Destek İste</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dbeafe] text-[#1e40af] text-xs font-semibold">
            <UserCog className="w-3.5 h-3.5" />
            <span>84425 - Ahmet</span>
          </div>
        </div>
      </div>

      {/* Sub Toolbar matching mutfak_ekrani_1789840893669.png */}
      <div className="h-12 px-6 flex items-center justify-between shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-300 text-xs font-semibold text-[#374151] cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Geri Dön</span>
        </button>

        <div className="flex items-center gap-3 text-xs font-semibold text-[#374151]">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-300 cursor-pointer"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sırala</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-300 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Hazırlanıyor Aşaması</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-300 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Hazırlanan Siparişler</span>
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-300 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Ayarlar</span>
          </button>
        </div>
      </div>

      {/* Kitchen Orders Grid matching mutfak_ekrani_1789840893669.png */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Takeaway / Gel Al Sipariş */}
          {!ticket1Completed && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#4ade80] flex items-center justify-center text-white shadow-2xs">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#111827]">
                      Ahmet <span className="text-gray-400 font-normal">/ 103</span>
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTicket1Completed(true)}
                  className="px-3 py-1 rounded bg-[#e5e7eb] hover:bg-gray-300 text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Tümü Hazır
                </button>
              </div>

              {/* Order Items & Timers */}
              <div className="p-4 bg-[#fafbfc]">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#b45309]">
                      Hazırlanıyor
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#991b1b] text-white font-mono text-xs font-bold shadow-2xs">
                      {formatTime(timer1)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <User className="w-3 h-3" />
                      Ahmet
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      1 Tam - Çay
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTicket1Completed(true)}
                    className="px-3 py-1 rounded bg-[#e5e7eb] hover:bg-green-600 hover:text-white text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
                  >
                    Hazır
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Card 2: Table / Masa 1 Siparişi */}
          {!ticket2Completed && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#facc15] flex items-center justify-center text-amber-900 shadow-2xs">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#111827] block">
                      Ahmet <span className="text-gray-400 font-normal">/ 102</span>
                    </span>
                    <span className="text-xs text-gray-500 block">
                      Salon / Masa 1
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTicket2Completed(true)}
                  className="px-3 py-1 rounded bg-[#e5e7eb] hover:bg-gray-300 text-xs font-semibold text-gray-700 cursor-pointer"
                >
                  Tümü Hazır
                </button>
              </div>

              {/* Order Items & Timers */}
              <div className="p-4 bg-[#fefce8]/40">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#b45309]">
                      Hazırlanıyor
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#991b1b] text-white font-mono text-xs font-bold shadow-2xs">
                      {formatTime(timer2)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                      <User className="w-3 h-3" />
                      Ahmet
                    </span>
                    <span className="text-xs font-bold text-gray-900">
                      1 Tam - Çay
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTicket2Completed(true)}
                    className="px-3 py-1 rounded bg-[#e5e7eb] hover:bg-green-600 hover:text-white text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
                  >
                    Hazır
                  </button>
                </div>
              </div>
            </div>
          )}

          {ticket1Completed && ticket2Completed && (
            <div className="col-span-full py-16 text-center text-gray-400 text-sm">
              Tüm mutfak siparişleri hazırlandı. Yeni sipariş bekleniyor...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
