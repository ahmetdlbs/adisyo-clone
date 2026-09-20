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
    <div className="flex flex-col flex-1 bg-[#edf0f5] overflow-hidden select-none">
      {/* Top Header removed to use MainLayout's TopHeader */}

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
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between p-3 rounded-md border border-orange-200 bg-orange-50/50 relative">
                  {/* Left border accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-md"></div>
                  
                  <div className="flex items-start gap-6 ml-2">
                    {/* Status & Timer Column */}
                    <div className="flex flex-col gap-1.5 w-[85px]">
                      <span className="text-xs font-semibold text-[#f59e0b]">
                        Hazırlanıyor
                      </span>
                      <div className="px-2 py-1 rounded-md bg-[#b91c1c] text-white text-center text-xs shadow-sm">
                        {formatTime(timer1)}
                      </div>
                    </div>

                    {/* Waiter & Item Column */}
                    <div className="flex flex-col justify-between py-0.5 h-[42px]">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                        <User className="w-3.5 h-3.5" />
                        Ahmet
                      </span>
                      <span className="text-[13px] text-gray-900">
                        1 Tam - Çay
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTicket1Completed(true)}
                    className="px-4 py-2 rounded-md bg-[#e5e7eb] hover:bg-green-600 hover:text-white text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
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
              <div className="p-4 bg-white">
                <div className="flex items-center justify-between p-3 rounded-md border border-orange-200 bg-orange-50/50 relative">
                  {/* Left border accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 rounded-l-md"></div>
                  
                  <div className="flex items-start gap-6 ml-2">
                    {/* Status & Timer Column */}
                    <div className="flex flex-col gap-1.5 w-[85px]">
                      <span className="text-xs font-semibold text-[#f59e0b]">
                        Hazırlanıyor
                      </span>
                      <div className="px-2 py-1 rounded-md bg-[#b91c1c] text-white text-center text-xs shadow-sm">
                        {formatTime(timer2)}
                      </div>
                    </div>

                    {/* Waiter & Item Column */}
                    <div className="flex flex-col justify-between py-0.5 h-[42px]">
                      <span className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                        <User className="w-3.5 h-3.5" />
                        Ahmet
                      </span>
                      <span className="text-[13px] text-gray-900">
                        1 Tam - Çay
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setTicket2Completed(true)}
                    className="px-4 py-2 rounded-md bg-[#e5e7eb] hover:bg-green-600 hover:text-white text-xs font-semibold text-gray-700 cursor-pointer transition-colors"
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
