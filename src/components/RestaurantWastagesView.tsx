"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  Download,
  Plus,
  Search,
  Calendar,
  X,
  Save,
  Users
} from "lucide-react";

export default function RestaurantWastagesView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative h-[calc(100vh-100px)]">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4 shrink-0 relative z-10 bg-white rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-[#f97316] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                <TrendingDown className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Zayi İşlemleri</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Yeni bir zayi ekleyebilir veya zayi işlemlerinizi buradan yönetebilirsiniz.
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-[#d32f2f] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors">
                <Users className="w-4 h-4" />
                Sorumluları Düzenle
              </button>
              <button className="flex items-center gap-2 px-4 py-2 text-[#d32f2f] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                İndir
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col">
          <div className="flex flex-col h-full">
            {/* Filters */}
            <div className="p-6 bg-white border-b border-gray-100 flex gap-6 items-end">
              <div className="relative flex-1 max-w-[200px]">
                <input
                  type="date"
                  defaultValue="2026-09-20"
                  className="peer w-full h-10 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-1 text-[10px] font-medium text-gray-500 uppercase transition-all peer-focus:text-[#d32f2f]">
                  Başlangıç Tarihi
                </label>
              </div>
              
              <div className="relative flex-1 max-w-[200px]">
                <input
                  type="date"
                  defaultValue="2026-09-20"
                  className="peer w-full h-10 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-1 text-[10px] font-medium text-gray-500 uppercase transition-all peer-focus:text-[#d32f2f]">
                  Bitiş Tarihi
                </label>
              </div>

              <div className="relative flex-1 max-w-[250px]">
                <select className="peer w-full h-10 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] appearance-none pt-4 pb-1">
                  <option>Hepsi</option>
                  <option>Ahmet Can</option>
                </select>
                <label className="absolute left-0 top-1 text-[10px] font-medium text-gray-500 uppercase transition-all peer-focus:text-[#d32f2f]">
                  Sorumlu Kişi
                </label>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <button className="h-10 px-8 flex items-center justify-center bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded-md transition-colors shadow-sm ml-auto">
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-4 grid grid-cols-7 gap-4 bg-white border-b border-gray-100 text-sm font-semibold text-gray-600">
              <div>Ürün</div>
              <div>Zayi Nedeni</div>
              <div>Adet</div>
              <div>Zayi Tarihi</div>
              <div>Eklenme Tarihi</div>
              <div>Sorumlu Kişi</div>
              <div className="text-right">Maliyet Tutarı(₺)</div>
            </div>

            {/* Table Body - Empty State */}
            <div className="flex-1 flex flex-col p-6 bg-[#f8fafc]">
              <div className="w-full bg-[#f1f5f9] rounded-lg p-4 text-sm text-gray-600 text-left border border-gray-200">
                Herhangi bir sonuç bulunamadı.
              </div>
            </div>

            {/* Table Footer */}
            <div className="p-4 px-6 bg-white border-t border-gray-100 flex items-center justify-between shrink-0 font-bold text-gray-900">
              <span className="ml-[70%]">Toplam</span>
              <span>₺0,00</span>
            </div>
          </div>
        </div>
      </div>

      {/* New Wastage Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[550px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 pb-2">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Zayi Ekle</h2>
                <p className="text-xs text-gray-500 mt-1">Bu pencereden zayi ekleyebilir, güncelleyebilir yada silebilirsiniz.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#d32f2f] hover:bg-red-50 p-2 rounded-lg transition-colors -mr-2 -mt-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-5 pt-4">
              
              <div className="relative">
                <select className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] appearance-none pt-4 pb-1">
                  <option value="" disabled selected></option>
                  <option value="1">Kola</option>
                  <option value="2">Ayran</option>
                </select>
                <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f]">
                  Ürün Ara
                </label>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <input
                    type="number"
                    placeholder=" "
                    className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                  />
                  <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                    Miktar*
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    placeholder=" "
                    className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                  />
                  <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                    Maliyet tutarı(₺)*
                  </label>
                </div>
              </div>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-09-20"
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-1 text-[10px] font-medium text-gray-500 transition-all peer-focus:text-[#d32f2f]">
                  Zayi Tarihi
                </label>
              </div>

              <div className="relative">
                <textarea
                  rows={2}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1 resize-none"
                ></textarea>
                <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                  Zayi nedeni*
                </label>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                  Sorumlu Kişi*
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 flex items-center justify-between bg-white border-t border-gray-100">
              <div className="text-sm">
                <span className="text-gray-500">Satış Kanalı: </span>
                <span className="text-[#d32f2f] font-semibold">Ana Kanal</span>
              </div>
              <button className="flex items-center gap-2 px-6 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-medium text-sm rounded-lg transition-colors shadow-sm">
                <Save className="w-4 h-4" />
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
