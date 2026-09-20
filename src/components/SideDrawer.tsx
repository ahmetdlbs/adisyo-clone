"use client";

import React, { useState } from "react";
import {
  Home,
  Layers,
  Smartphone,
  CheckSquare,
  ShoppingBag,
  Tv,
  Briefcase,
  Users,
  PieChart,
  Printer,
  Grid,
  Gift,
  ChevronDown,
  ChevronRight,
  X,
  LogOut,
  TrendingUp,
  DollarSign,
  Receipt,
  Truck,
  Archive,
  Sliders,
} from "lucide-react";
import AdisyoLogo from "./AdisyoLogo";

export type ViewType =
  | "dashboard"
  | "order"
  | "table-area-definition"
  | "product-definition"
  | "reports"
  | "kitchen"
  | "expenses";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView: (view: ViewType) => void;
  onLogout: () => void;
}

export default function SideDrawer({
  isOpen,
  onClose,
  onSelectView,
  onLogout,
}: SideDrawerProps) {
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    tanimlamalar: true,
    islemler: true,
    raporlar: true,
    entegrasyon: false,
    kullanicilar: false,
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-72 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AdisyoLogo size="sm" />
            <span className="text-[11px] font-medium text-gray-400">3.0</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User / Branch Info matching screenshot */}
        <div className="px-4 py-2.5 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-600 tracking-wider">
          AHMET - 84425
        </div>

        {/* Menu Items List matching media_1789840462748.png */}
        <div className="flex-1 overflow-y-auto py-2 px-2 text-xs text-[#2b2f36] space-y-0.5">
          {/* Ana Sayfa */}
          <button
            type="button"
            onClick={() => {
              onSelectView("dashboard");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Home className="w-4 h-4 text-gray-600" />
            <span>Ana Sayfa</span>
          </button>

          {/* Entegrasyon İşlemleri */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("entegrasyon")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-gray-600" />
                <span>Entegrasyon İşlemleri</span>
              </div>
              {openDropdowns.entegrasyon ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            {openDropdowns.entegrasyon && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs text-gray-600">
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">Yemeksepeti</div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">Getir Yemek</div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">Trendyol Yemek</div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">Migros Yemek</div>
              </div>
            )}
          </div>

          {/* Dijital Menü (Yepyeni badge) */}
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone className="w-4 h-4 text-gray-600" />
              <span>Dijital Menü</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#dc2626] text-white">
              Yepyeni
            </span>
          </div>

          {/* Tanımlamalar */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("tanimlamalar")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-gray-600" />
                <span>Tanımlamalar</span>
              </div>
              {openDropdowns.tanimlamalar ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            {openDropdowns.tanimlamalar && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs text-gray-600">
                <div
                  onClick={() => {
                    onSelectView("table-area-definition");
                    onClose();
                  }}
                  className="py-1 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Masa / Bölgeler
                </div>
                <div
                  onClick={() => {
                    onSelectView("product-definition");
                    onClose();
                  }}
                  className="py-1 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Menü / Ürünler
                </div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">
                  Yazıcılar
                </div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">
                  Ödeme Tipleri
                </div>
              </div>
            )}
          </div>

          {/* Sipariş */}
          <button
            type="button"
            onClick={() => {
              onSelectView("order");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <ShoppingBag className="w-4 h-4 text-gray-600" />
            <span>Sipariş</span>
          </button>

          {/* Mutfak */}
          <button
            type="button"
            onClick={() => {
              onSelectView("kitchen");
              onClose();
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Tv className="w-4 h-4 text-gray-600" />
            <span>Mutfak</span>
          </button>

          {/* İşlemler */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("islemler")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-gray-600" />
                <span>İşlemler</span>
              </div>
              {openDropdowns.islemler ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            {openDropdowns.islemler && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs text-gray-600">
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">
                  Stok İşlemleri
                </div>
                <div
                  onClick={() => {
                    onSelectView("expenses");
                    onClose();
                  }}
                  className="py-1 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Gider / Masraf İşlemleri
                </div>
                <div className="py-1 hover:text-[#b84a43] cursor-pointer">
                  Zayi İşlemleri
                </div>
              </div>
            )}
          </div>

          {/* Kullanıcılar */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("kullanicilar")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-gray-600" />
                <span>Kullanıcılar</span>
              </div>
              {openDropdowns.kullanicilar ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Raporlar (Expanded by default) */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("raporlar")}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PieChart className="w-4 h-4 text-gray-600" />
                <span>Raporlar</span>
              </div>
              {openDropdowns.raporlar ? (
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>
            {openDropdowns.raporlar && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-xs text-gray-600">
                <div
                  onClick={() => {
                    onSelectView("reports");
                    onClose();
                  }}
                  className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Ürün Satış Raporu</span>
                </div>
                <div
                  onClick={() => {
                    onSelectView("reports");
                    onClose();
                  }}
                  className="py-1.5 flex items-center gap-2 bg-gray-100 text-[#111827] font-bold px-2 rounded -ml-2 cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5 text-[#b84a43]" />
                  <span>Gün Sonu Raporu</span>
                </div>
                <div className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Vardiya Satış Raporu</span>
                </div>
                <div className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <PieChart className="w-3.5 h-3.5" />
                  <span>Restaurant İstatistikleri</span>
                </div>
                <div className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Stok Durum Raporu</span>
                </div>
                <div className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Archive className="w-3.5 h-3.5" />
                  <span>Fire Raporu</span>
                </div>
                <div className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Rapor Sihirbazı</span>
                </div>
              </div>
            )}
          </div>

          {/* Yazıcılar */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Printer className="w-4 h-4 text-gray-600" />
            <span>Yazıcılar</span>
          </button>

          {/* Uygulama Mağazası */}
          <button
            type="button"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Grid className="w-4 h-4 text-gray-600" />
            <span>Uygulama Mağazası</span>
          </button>

          {/* Tavsiye Et ve Kazan (Gold highlight with red Yeni badge) */}
          <div className="bg-[#fef3c7] hover:bg-[#fde68a] text-amber-950 flex items-center justify-between px-3 py-2.5 rounded-lg font-semibold cursor-pointer transition-colors mt-2">
            <div className="flex items-center gap-3">
              <Gift className="w-4 h-4 text-amber-800" />
              <span>Tavsiye Et ve Kazan</span>
            </div>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#dc2626] text-white">
              Yeni
            </span>
          </div>
        </div>

        {/* Drawer Footer (Logout) */}
        <div className="p-3 border-t border-gray-100">
          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-50 text-[#b5473f] hover:bg-red-100 text-xs font-semibold cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </div>
    </div>
  );
}
