"use client";

import React, { useState } from "react";
import {
  Menu,
  Gift,
  Users,
  RefreshCw,
  MoreVertical,
  Megaphone,
  Headphones,
  UserCog,
  ChevronRight,
  Printer,
  Download,
  Calendar,
} from "lucide-react";

interface EndOfDayReportViewProps {
  onOpenDrawer: () => void;
  openOrdersTotal: number;
}

export default function EndOfDayReportView({
  onOpenDrawer,
  openOrdersTotal,
}: EndOfDayReportViewProps) {
  const [selectedReport, setSelectedReport] = useState<string>("ozet");

  const reportSubItems = [
    { id: "ozet", label: "Özet" },
    { id: "tum-adisyonlar", label: "Tüm Adisyonlar" },
    { id: "yogunluk-raporu", label: "Yoğunluk Raporu" },
    { id: "masa-siparisleri", label: "Masa Siparişleri" },
    { id: "gel-al-siparisler", label: "Gel Al Siparişler" },
    { id: "paket-siparisler", label: "Paket Siparişler" },
    { id: "acik-hesap", label: "Açık Hesap Hareketleri" },
    { id: "odenmezler", label: "Ödenmezler" },
    { id: "garson-satislar", label: "Garson Bazlı Satışlar" },
    { id: "iptal-iadeler", label: "İptal / İadeler" },
    { id: "masraflar", label: "Masraflar" },
    { id: "zayi-urunler", label: "Zayi Olan Ürünler" },
    { id: "silinen-urunler", label: "Silinen Ürünler" },
    { id: "silinen-tahsilatlar", label: "Silinen Tahsilatlar" },
  ];

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
            Gün Sonu Raporları
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

      {/* Main 2-column Split (Left sub-menu matching screenshot, Right report preview) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-Menu matching gun_sonu_raporu_1789840861258.png */}
        <div className="w-64 bg-white border-r border-[#d8dde4] flex flex-col shrink-0 overflow-y-auto py-2">
          {reportSubItems.map((item) => {
            const isActive = selectedReport === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedReport(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-xs text-left font-medium transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#e5e7eb] text-[#111827] font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 text-gray-500" />}
              </button>
            );
          })}
        </div>

        {/* Right Report Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Action Bar */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>Tarih: 19.09.2026 (Güncel Vardiya)</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("Rapor İndirildi (PDF/Excel)")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Yazıcıya Gönderildi")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#b84a43] text-white text-xs font-semibold hover:bg-[#a53f38] cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır (Z Raporu)</span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium">Toplam Satış Tutarı</span>
              <p className="text-xl font-bold text-gray-900 mt-1">₺0,00</p>
              <span className="text-[11px] text-gray-400">Kapalı Adisyonlar</span>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium">Açık Siparişler Toplamı</span>
              <p className="text-xl font-bold text-[#b84a43] mt-1">
                ₺{openOrdersTotal.toFixed(2).replace(".", ",")}
              </p>
              <span className="text-[11px] text-gray-400">Masa 1 ve Açık Hesaplar</span>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium">Ağırlanan Misafir</span>
              <p className="text-xl font-bold text-blue-600 mt-1">2</p>
              <span className="text-[11px] text-gray-400">Günlük Toplam</span>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-2xs">
              <span className="text-xs text-gray-500 font-medium">Giderler / Masraflar</span>
              <p className="text-xl font-bold text-gray-900 mt-1">₺0,00</p>
              <span className="text-[11px] text-gray-400">Kasadan Çıkan</span>
            </div>
          </div>

          {/* Payment breakdown table */}
          <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-2xs">
            <h3 className="font-bold text-sm text-gray-900 mb-4">
              Ödeme Tiplerine Göre Dağılım
            </h3>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex items-center justify-between text-gray-600">
                <span>Nakit</span>
                <span className="font-semibold text-gray-900">₺0,00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-gray-600">
                <span>Kredi Kartı</span>
                <span className="font-semibold text-gray-900">₺0,00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-gray-600">
                <span>Sodexo / Multinet / Ticket</span>
                <span className="font-semibold text-gray-900">₺0,00</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-gray-600">
                <span>İkram / İndirimler</span>
                <span className="font-semibold text-gray-900">₺0,00</span>
              </div>
              <div className="py-3 flex items-center justify-between font-bold text-sm text-gray-900 bg-gray-50 px-2 rounded mt-2">
                <span>Genel Toplam Tahsilat</span>
                <span>₺0,00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
