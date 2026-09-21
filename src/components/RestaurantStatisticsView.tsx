"use client";
import React, { useState } from "react";
import { Filter, ChevronRight, Check, PieChart, CreditCard, BarChart2, Receipt, Package, Users, TrendingDown, ClipboardList, PlusSquare, Wallet, Landmark, X } from "lucide-react";

type TabKey = "ozet" | "gunluk_ciro" | "grafik" | "paket" | "satis_kanali" | "garson" | "odenmez";

export default function RestaurantStatisticsView() {
  const [activeTab, setActiveTab] = useState<TabKey>("ozet");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
  const dateRange = `(${dateStr} - ${dateStr})`;

  const TABS = [
    { id: "ozet", label: "Özet" },
    { id: "gunluk_ciro", label: "Günlük Ciro Verileri" },
    { id: "grafik", label: "Grafik Verileri" },
    { id: "paket", label: "Paket Siparişler" },
    { id: "satis_kanali", label: "Satış Kanalı Bazında Satışlar" },
    { id: "garson", label: "Garson Bazlı Satışlar" },
    { id: "odenmez", label: "Ödenmez Bazlı Satışlar" },
  ];

  const renderContent = () => {
    if (activeTab === "ozet") {
      return (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#6366f1] rounded flex items-center justify-center text-white shadow-sm">
                <Check size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Net Kâr</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Brüt Kâr - Gider Toplamı
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#0f766e] rounded flex items-center justify-center text-white shadow-sm">
                <PieChart size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Brüt Kâr</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Ciro - Satılan Ürün Maliyeti
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#b91c1c] rounded flex items-center justify-center text-white shadow-sm">
                <CreditCard size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihteki satış toplamı</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                ₺0,00 KDV
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#be123c] rounded flex items-center justify-center text-white shadow-sm">
                <BarChart2 size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide max-w-[200px] ml-auto">Verilen tarihe aralığına göre günlük ortalama satış (Toplam satış / Gün sayısı)</div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#3b82f6] rounded flex items-center justify-center text-white shadow-sm">
                <Receipt size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Satılan Ürün Maliyeti</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Satış Anındaki Ortalama Maliyet
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#7e22ce] rounded flex items-center justify-center text-white shadow-sm">
                <Package size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Toplam Stok Maliyeti</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Depodaki Ürün Maliyeti
              </div>
            </div>

            {/* Row 3 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#6b21a8] rounded flex items-center justify-center text-white shadow-sm">
                <div className="font-bold">9+</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">0</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe göre toplam adisyon sayısı</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#5b21b6] rounded flex items-center justify-center text-white shadow-sm">
                <CreditCard size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe göre bir güne düşen ortalama adisyon tutarı</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#3730a3] rounded flex items-center justify-center text-white shadow-sm">
                <CreditCard size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe göre kişi başı ortalama adisyon tutarı</div>
              </div>
            </div>

            {/* Row 4 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#4338ca] rounded flex items-center justify-center text-white shadow-sm">
                <div className="font-bold">9+</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">0</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe göre bir güne düşen ortalama adisyon sayısı</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#1d4ed8] rounded flex items-center justify-center text-white shadow-sm">
                <TrendingDown size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe yapılan toplam indirim tutarı</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Ürün Bazlı İndirim :₺0,00 | Adisyon Bazlı İndirim :₺0,00
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#15803d] rounded flex items-center justify-center text-white shadow-sm">
                <ClipboardList size={24} />
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-medium">Toplam Bahşiş</div>
                <div className="text-3xl font-light text-gray-800 mt-1">₺0,00</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-green-600 font-medium text-right">
                Ciroya Göre Oran: %0.00
              </div>
            </div>

            {/* Row 5 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#0ea5e9] rounded flex items-center justify-center text-white shadow-sm">
                <Users size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">0</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Verilen tarihe göre ağırlanan misafir sayısı</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Masa Siparişi :0 |
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#0f766e] rounded flex items-center justify-center text-white shadow-sm">
                <TrendingDown size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Toplam masraf (0 adet)</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-blue-500 hover:underline cursor-pointer text-right">
                Ödeme Tipi Detayı
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#4ade80] rounded flex items-center justify-center text-white shadow-sm">
                <PlusSquare size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Tahsil edilmemiş tutar</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Açık Hesap Borç :₺0,00 | Açık Sipariş Toplam :₺0,00
              </div>
            </div>

            {/* Row 6 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#84cc16] rounded flex items-center justify-center text-white shadow-sm">
                <Wallet size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Tahsil edilmiş tutar</div>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-4 text-xs text-gray-400 text-right">
                Açık Hesap Tahsilat :₺0,00 | Adisyonlu Tahsilat :₺0,00
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#a3e635] rounded flex items-center justify-center text-white shadow-sm">
                <Wallet size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Toplam Alacak Fişi</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden flex flex-col justify-between h-[140px]">
              <div className="absolute top-5 left-5 w-12 h-12 bg-[#a16207] rounded flex items-center justify-center text-white shadow-sm">
                <Landmark size={24} />
              </div>
              <div className="text-right">
                <div className="text-3xl font-light text-gray-800">₺0,00</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wide">Toplam Borç Fişi</div>
              </div>
            </div>
            
          </div>
        </div>
      );
    }
    
    // Placeholder for other tabs
    return (
      <div className="p-12 flex flex-col items-center justify-center text-gray-500 font-medium text-lg">
        LÜTFEN FİLTRELEME YAPINIZ
      </div>
    );
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f3f4f6]">
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 bg-[#e5e7eb]/50 border-r border-gray-200">
        <div className="py-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id 
                  ? "bg-gray-200/80 text-gray-900" 
                  : "text-gray-800 hover:bg-gray-200/50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={16} className="text-gray-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] bg-[#f3f4f6]">
        {/* Header */}
        <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-[#f3f4f6]">
          <h1 className="text-[15px] font-semibold text-gray-900">
            {TABS.find(t => t.id === activeTab)?.label} <span className="text-gray-500 font-normal">{dateRange}</span>
          </h1>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <Filter size={16} />
              Filtrele
            </button>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Filter Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[380px] bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-medium text-gray-800">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto px-6 py-4 flex flex-col gap-6">
              
              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Tarih</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option>Bugün</option>
                  <option>Dün</option>
                  <option>Bu Hafta</option>
                  <option>Bu Ay</option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Saati</label>
                <input type="text" defaultValue="06:00" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Saati*</label>
                <input type="text" defaultValue="23:45" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Sipariş Tipi</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option></option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 text-[14px] font-medium text-white bg-[#dc3545] rounded hover:bg-red-700 transition-colors"
              >
                Filtrele
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
