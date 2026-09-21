"use client";
import React, { useState } from "react";
import { Filter, Download, Printer, ChevronRight, X } from "lucide-react";

type TabKey = "urun_stok";

export default function StockProductQuantityView() {
  const [activeTab, setActiveTab] = useState<TabKey>("urun_stok");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const TABS = [
    { id: "urun_stok", label: "Ürünlerin stok durumu" },
  ];

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
            {TABS.find(t => t.id === activeTab)?.label}
          </h1>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              <Filter size={16} />
              Filtrele
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <Download size={16} />
              İndir
            </button>
            <button className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              <Printer size={16} />
              Yazdır
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200">
            <table className="w-full text-left border-collapse whitespace-nowrap text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-medium">
                  <th className="py-3 px-4 font-semibold text-[13px]">#No</th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Ürün Kodu <span className="text-red-500 font-normal">⇅</span></th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Kategori <span className="text-red-500 font-normal">⇅</span></th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Ürün Adı <span className="text-red-500 font-normal">⇅</span></th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Mutfak Grubu</th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Stok Miktarı <span className="text-red-500 font-normal">⇅</span></th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Kritik Stok Miktarı <span className="text-red-500 font-normal">⇅</span></th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Stok Birimi</th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Birim Tutarı(₺)</th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Toplam Tutar(₺)</th>
                  <th className="py-3 px-4 font-semibold text-[13px]">Detay</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100 border-b border-gray-200 text-gray-800 font-medium">
                  <td className="py-3 px-4 text-center" colSpan={5}>Toplam</td>
                  <td className="py-3 px-4 text-left">0</td>
                  <td className="py-3 px-4" colSpan={3}></td>
                  <td className="py-3 px-4 text-left">₺0,00</td>
                  <td className="py-3 px-4"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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
