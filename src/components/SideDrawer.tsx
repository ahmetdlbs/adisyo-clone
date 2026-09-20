"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
}

export default function SideDrawer({
  isOpen,
  onClose,
  onLogout,
}: SideDrawerProps) {
  const router = useRouter();
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

  const handleNavigate = (path: string) => {
    router.push(path);
    onClose();
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
        <div className="px-4 py-3 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-600 tracking-wider">
          AHMET - 84425
        </div>

        {/* Menu Items List matching media_1789840462748.png */}
        <div className="flex-1 overflow-y-auto py-2 px-2 text-[14px] text-[#3b414f] space-y-1">
          {/* Ana Sayfa */}
          <button
            type="button"
            onClick={() => handleNavigate("/dashboard")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Home className="w-5 h-5 text-gray-500" />
            <span>Ana Sayfa</span>
          </button>

          {/* Entegrasyon İşlemleri */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("entegrasyon")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Layers className="w-5 h-5 text-gray-500" />
                <span>Entegrasyon İşlemleri</span>
              </div>
              {openDropdowns.entegrasyon ? (
                <ChevronDown className="w-[18px] h-[18px] text-gray-400" />
              ) : (
                <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              )}
            </button>
            {openDropdowns.entegrasyon && (
              <div className="pl-11 pr-2 py-1 space-y-0.5 text-[13px] text-[#555]">
                <div onClick={() => handleNavigate("/integration-menu-operations")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">Menü Operasyonları</div>
                <div onClick={() => handleNavigate("/product-pairing")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">Ürün Eşleştirme</div>
              </div>
            )}
          </div>

          {/* Dijital Menü (Yepyeni badge) */}
          <div className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium cursor-pointer">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-500" />
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
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <CheckSquare className="w-5 h-5 text-gray-500" />
                <span>Tanımlamalar</span>
              </div>
              {openDropdowns.tanimlamalar ? (
                <ChevronDown className="w-[18px] h-[18px] text-gray-400" />
              ) : (
                <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              )}
            </button>
            {openDropdowns.tanimlamalar && (
              <div className="pl-11 pr-2 py-1 space-y-0.5 text-[13px] text-[#555]">
                <div
                  onClick={() => handleNavigate("/table-area-definition")}
                  className="py-1.5 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Masa / Bölgeler
                </div>
                <div
                  onClick={() => handleNavigate("/product-definition")}
                  className="py-1.5 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Menü / Ürünler
                </div>
                <div onClick={() => handleNavigate("/product-units")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Ürün Birimleri
                </div>
                <div onClick={() => handleNavigate("/features")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Özellikler
                </div>
                <div onClick={() => handleNavigate("/vat-definitions")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  KDV Tanımlamaları
                </div>
                <div onClick={() => handleNavigate("/discounts")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  İndirimler
                </div>
                <div onClick={() => handleNavigate("/kitchen-groups")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Mutfak Grupları
                </div>
              </div>
            )}
          </div>

          {/* Sipariş */}
          <button
            type="button"
            onClick={() => handleNavigate("/orders")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <ShoppingBag className="w-5 h-5 text-gray-500" />
            <span>Sipariş</span>
          </button>

          {/* Mutfak */}
          <button
            type="button"
            onClick={() => handleNavigate("/kitchen-detail/98012")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Tv className="w-5 h-5 text-gray-500" />
            <span>Mutfak</span>
          </button>

          {/* İşlemler */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("islemler")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-gray-500" />
                <span>İşlemler</span>
              </div>
              {openDropdowns.islemler ? (
                <ChevronDown className="w-[18px] h-[18px] text-gray-400" />
              ) : (
                <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              )}
            </button>
            {openDropdowns.islemler && (
              <div className="pl-11 pr-2 py-1 space-y-0.5 text-[13px] text-[#555]">
                <div onClick={() => handleNavigate("/restaurant-customers")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Müşteriler
                </div>
                <div onClick={() => handleNavigate("/restaurant-paidlesses")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Veresiye
                </div>
                <div onClick={() => handleNavigate("/service-operations")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Servis İşlemleri
                </div>
                <div onClick={() => handleNavigate("/control-page")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Kontrol Ekranı
                </div>
                <div onClick={() => handleNavigate("/stock-list")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Stok Listesi
                </div>
                <div
                  onClick={() => handleNavigate("/restaurant-expenses")}
                  className="py-1.5 hover:text-[#b84a43] cursor-pointer font-medium"
                >
                  Gider / Masraf İşlemleri
                </div>
                <div onClick={() => handleNavigate("/restaurant-wastages")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">
                  Fireler
                </div>
              </div>
            )}
          </div>

          {/* Kullanıcılar */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("kullanicilar")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
                <span>Kullanıcılar</span>
              </div>
              {openDropdowns.kullanicilar ? (
                <ChevronDown className="w-[18px] h-[18px] text-gray-400" />
              ) : (
                <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              )}
            </button>
            {openDropdowns.kullanicilar && (
              <div className="pl-11 pr-2 py-1 space-y-0.5 text-[13px] text-[#555]">
                <div onClick={() => handleNavigate("/users")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">Kullanıcılar</div>
                <div onClick={() => handleNavigate("/rights")} className="py-1.5 hover:text-[#b84a43] cursor-pointer">Haklar</div>
              </div>
            )}
          </div>

          {/* Raporlar (Expanded by default) */}
          <div>
            <button
              type="button"
              onClick={() => toggleDropdown("raporlar")}
              className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-gray-500" />
                <span>Raporlar</span>
              </div>
              {openDropdowns.raporlar ? (
                <ChevronDown className="w-[18px] h-[18px] text-gray-400" />
              ) : (
                <ChevronRight className="w-[18px] h-[18px] text-gray-400" />
              )}
            </button>
            {openDropdowns.raporlar && (
              <div className="pl-11 pr-2 py-1 space-y-0.5 text-[13px] text-[#555]">
                <div
                  onClick={() => handleNavigate("/report-sales-products")}
                  className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer"
                >
                  <TrendingUp className="w-[18px] h-[18px]" />
                  <span>Ürün Satış Raporu</span>
                </div>
                <div
                  onClick={() => handleNavigate("/reports")}
                  className="py-1.5 flex items-center gap-2 bg-gray-100 text-[#111827] font-bold px-2 rounded -ml-2 cursor-pointer"
                >
                  <DollarSign className="w-[18px] h-[18px] text-[#b84a43]" />
                  <span>Gün Sonu Raporu</span>
                </div>
                <div onClick={() => handleNavigate("/shift-sales")} className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Receipt className="w-[18px] h-[18px]" />
                  <span>Vardiya Satış Raporu</span>
                </div>
                <div onClick={() => handleNavigate("/restaurant-statistics")} className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <PieChart className="w-[18px] h-[18px]" />
                  <span>Restaurant İstatistikleri</span>
                </div>
                <div onClick={() => handleNavigate("/stock-product-quantity")} className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Truck className="w-[18px] h-[18px]" />
                  <span>Stok Durum Raporu</span>
                </div>
                <div onClick={() => handleNavigate("/wastage-product-report")} className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Archive className="w-[18px] h-[18px]" />
                  <span>Fire Raporu</span>
                </div>
                <div onClick={() => handleNavigate("/reporting-wizard")} className="py-1.5 flex items-center gap-2 hover:text-[#b84a43] cursor-pointer">
                  <Sliders className="w-[18px] h-[18px]" />
                  <span>Rapor Sihirbazı</span>
                </div>
              </div>
            )}
          </div>

          {/* Yazıcılar */}
          <button
            type="button"
            onClick={() => handleNavigate("/printer-settings")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Printer className="w-5 h-5 text-gray-500" />
            <span>Yazıcılar</span>
          </button>

          {/* Uygulama Mağazası */}
          <button
            type="button"
            onClick={() => handleNavigate("/app-store")}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 font-medium transition-colors cursor-pointer text-left"
          >
            <Grid className="w-5 h-5 text-gray-500" />
            <span>Uygulama Mağazası</span>
          </button>

          {/* Tavsiye Et ve Kazan (Gold highlight with red Yeni badge) */}
          <div onClick={() => handleNavigate("/referral")} className="bg-[#fef3c7] hover:bg-[#fde68a] text-amber-950 flex items-center justify-between px-3 py-3 rounded-lg font-semibold cursor-pointer transition-colors mt-2">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-amber-800" />
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
            onClick={() => {
              if (onLogout) onLogout();
              router.push("/login");
            }}
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
