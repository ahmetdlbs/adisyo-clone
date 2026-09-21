"use client";

import React, { useState } from "react";
import { Settings, Save, PlayCircle } from "lucide-react";

export default function RestaurantSettingsView() {
  const [activeTab, setActiveTab] = useState("Genel Ayarlar");

  const tabs = [
    "Genel Ayarlar",
    "Ödeme Tipleri",
    "Parametreler",
    "Döviz Ayarları",
    "Adres Bilgileri",
    "Entegrasyon"
  ];

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#f6f7fb] p-8 font-sans items-center pt-16">
      
      <div className="w-full max-w-4xl bg-[#fafafa] rounded-lg shadow-sm border border-gray-200 relative pt-8 pb-10 px-8">
        
        {/* Floating Icon Box */}
        <div className="absolute -top-6 left-8 w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center text-white">
          <Settings size={24} />
        </div>

        {/* Header with Güncelle button */}
        <div className="flex justify-between items-start ml-20 mb-6">
          <div>
            <h1 className="text-[20px] font-semibold text-gray-800">Restaurant Tanımlamaları</h1>
            <p className="text-[13px] text-gray-500 mt-1">Restaurantınız ile ilgili tanımlamaları bu alandan yapabilirsiniz.</p>
          </div>
          <button className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-4 py-2 rounded shadow-sm text-[14px] font-medium transition-colors">
            <Save size={16} />
            Güncelle
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center mb-8 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                activeTab === tab 
                  ? "border-yellow-400 text-gray-800" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-8">
          
          {/* Full Width Row */}
          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
            <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Restaurant Adı*</label>
            <input 
              type="text" 
              defaultValue="Ahmet"
              className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>

          {/* 2 Column Row */}
          <div className="grid grid-cols-2 gap-8">
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Gün Başlangıç*</label>
              <input 
                type="text" 
                defaultValue="06:00"
                className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Gün Bitiş*</label>
              <input 
                type="text" 
                defaultValue="23:45"
                className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* 2 Column Row with Button */}
          <div className="grid grid-cols-2 gap-8">
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Bildirim Sesi</label>
              <select className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent appearance-none cursor-pointer">
                <option>Ses 1</option>
                <option>Ses 2</option>
              </select>
              <div className="absolute right-0 top-3 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
            <div className="flex items-end pb-1">
              <button className="flex items-center gap-1 text-[#dc2626] hover:text-[#b91c1c] text-[14px] font-medium transition-colors">
                <PlayCircle size={18} />
                Dene
              </button>
            </div>
          </div>

          {/* 2 Column Row */}
          <div className="grid grid-cols-2 gap-8">
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Ekran kilit süresi (sn) (0 girilir ise devre dışı kalır)*</label>
              <input 
                type="text" 
                defaultValue="0"
                className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">İlk sipariş numarası (0-9999)*</label>
              <input 
                type="text" 
                defaultValue="101"
                className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* 2 Column Row with Button */}
          <div className="grid grid-cols-2 gap-8">
            <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
              <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Çalışma Tipleri</label>
              <select className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent appearance-none cursor-pointer">
                <option>Masa Siparişi, Paket Sipariş, Gel Al Sipariş</option>
              </select>
              <div className="absolute right-0 top-3 text-gray-400 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
              </div>
            </div>
            <div className="flex items-center justify-center pb-1">
              <button className="text-[#dc2626] hover:text-[#b91c1c] text-[14px] font-medium transition-colors">
                Konumu Kaydet
              </button>
            </div>
          </div>

          {/* Bottom Left Button */}
          <div className="mt-2">
            <button className="text-[#dc2626] hover:text-[#b91c1c] text-[14px] font-medium transition-colors">
              Gelir Merkezlerini Düzenle
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
