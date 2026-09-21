"use client";

import React, { useState } from "react";
import { User, ChevronLeft, ChevronRight, Save } from "lucide-react";

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState("Kullanıcı Bilgileri");

  const tabs = [
    "Kullanıcı Bilgileri",
    "Parola Değişikliği",
    "Gizlilik ve Güvenlik",
    "Dil ve Bölge Ayarları"
  ];

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#f6f7fb] p-8 font-sans items-center pt-16">
      
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 relative pt-12 pb-8 px-10">
        
        {/* Floating Icon Box */}
        <div className="absolute -top-6 left-8 w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg shadow-lg flex items-center justify-center text-white">
          <User size={28} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[22px] font-semibold text-gray-800">Profil</h1>
          <p className="text-[13px] text-gray-500 mt-1">Kullanıcı bilgilerinizi güncelleyebilirsiniz.</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center mb-8 border-b border-gray-200 relative">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronLeft size={18} />
          </button>
          
          <div className="flex-1 flex overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-4 py-3 text-[14px] font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? "border-yellow-400 text-gray-800" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-6 mb-8">
          
          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
            <label className="text-[11px] text-gray-500 absolute -top-3 left-0">İsim*</label>
            <input 
              type="text" 
              defaultValue="Ahmet"
              className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>

          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
            <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Soyisim*</label>
            <input 
              type="text" 
              defaultValue="Can"
              className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>

          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
            <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Telefon Numarası*</label>
            <input 
              type="text" 
              defaultValue="544 307 11 60"
              className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>

          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors">
            <label className="text-[11px] text-gray-500 absolute -top-3 left-0">Email*</label>
            <input 
              type="email" 
              defaultValue="softdeap@gmail.com"
              className="w-full pt-2 pb-1 text-[15px] text-gray-800 outline-none bg-transparent"
            />
          </div>

          <div className="relative border-b border-gray-300 focus-within:border-gray-500 transition-colors mt-2">
            <input 
              type="text" 
              placeholder="Pin Numarası (0 ile başlayamaz)"
              className="w-full py-1 text-[15px] text-gray-800 outline-none bg-transparent placeholder-gray-500"
            />
          </div>

        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white px-5 py-2.5 rounded shadow-sm text-[14px] font-medium transition-colors">
            <Save size={16} />
            Güncelle
          </button>
        </div>

      </div>
    </div>
  );
}
