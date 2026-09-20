"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  Download,
  ListFilter,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Save,
} from "lucide-react";

export default function RestaurantExpensesView() {
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
                <h1 className="text-xl font-bold text-gray-900">Gider ve Masraflar</h1>
                <p className="text-sm text-gray-500 mt-1">
                  Gider ve masraflarınızı bu sayfadan yönetebilirsiniz.
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-[#d32f2f] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors">
                <Download className="w-4 h-4" />
                İndir
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-lg transition-colors">
                <ListFilter className="w-4 h-4" />
                Masraf Tiplerini Düzenle
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Masraf Ekle
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col">
          <div className="flex flex-col h-full">
            {/* Filters */}
            <div className="p-6 bg-white border-b border-gray-100 flex flex-wrap gap-4 items-center">
              <div className="relative w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-20T06:00"
                  className="w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white"
                />
              </div>
              
              <div className="relative w-64">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="datetime-local"
                  defaultValue="2026-09-20T23:45"
                  className="w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white"
                />
              </div>

              <div className="relative w-48">
                <select className="w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white appearance-none">
                  <option>Tümü</option>
                  <option>Mutfak Gideri</option>
                  <option>Personel Avans</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative w-48">
                <select className="w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white appearance-none">
                  <option>Tümü</option>
                  <option>Nakit</option>
                  <option>Kredi Kartı</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              
              <button className="h-12 px-6 ml-auto flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-[#d32f2f] rounded-lg transition-colors font-medium text-sm">
                Filtreyi Temizle
              </button>
            </div>

            {/* Table Header */}
            <div className="px-6 py-4 grid grid-cols-8 gap-4 bg-white border-b border-gray-100 text-sm font-semibold text-gray-600">
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Masraf Tipi <span className="text-[#d32f2f] text-[10px]">↕</span></div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Masraf Tarihi <span className="text-[#d32f2f] text-[10px]">↕</span></div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Eklenme Tarihi <span className="text-[#d32f2f] text-[10px]">↕</span></div>
              <div>Kullanıcı</div>
              <div>Ödeme Tipi</div>
              <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">Tutar <span className="text-[#d32f2f] text-[10px]">↕</span></div>
              <div>Masraf Detayı</div>
              <div className="text-right">İşlemler</div>
            </div>

            {/* Table Body - Empty State */}
            <div className="flex-1 flex items-start justify-center p-6 bg-[#f8fafc]">
              <div className="w-full bg-[#f1f5f9] rounded-lg p-4 text-sm text-gray-600 text-left border border-gray-200">
                Herhangi bir sonuç bulunamadı, farklı filtreler deneyerek aramanızı genişletebilirsiniz.
              </div>
            </div>

            {/* Pagination */}
            <div className="p-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-medium">1 / 0</span>
                <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* New Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Ekle</h2>
                <p className="text-sm text-gray-500 mt-1">Eklemek istediğiniz masraf bilgilerini giriniz</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col gap-6">
              
              {/* Floating Label Inputs (Material Style) */}
              <div className="relative">
                <select className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] appearance-none pt-4 pb-1">
                  <option value="" disabled selected></option>
                  <option value="mutfak">Mutfak</option>
                  <option value="diger">Diğer</option>
                </select>
                <label className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-focus:text-[#d32f2f]">
                  Masraf tipi*
                </label>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative">
                <select className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] appearance-none pt-4 pb-1">
                  <option value="" disabled selected></option>
                  <option value="nakit">Nakit</option>
                  <option value="kredi_karti">Kredi Kartı</option>
                </select>
                <label className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-focus:text-[#d32f2f]">
                  Ödeme Tipi*
                </label>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>

              <div className="relative">
                <input
                  type="date"
                  defaultValue="2026-09-20"
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-focus:text-[#d32f2f]">
                  Masraf tarihini seçiniz*
                </label>
              </div>

              <div className="relative">
                <input
                  type="time"
                  defaultValue="20:27"
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-1 text-xs font-medium text-gray-500 transition-all peer-focus:text-[#d32f2f]">
                  Masraf saatini seçiniz*
                </label>
              </div>

              <div className="relative">
                <input
                  type="number"
                  placeholder=" "
                  className="peer w-full h-12 bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1"
                />
                <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                  Fiyat ₺*
                </label>
              </div>

              <div className="relative mt-2">
                <textarea
                  rows={2}
                  placeholder=" "
                  className="peer w-full bg-transparent border-b-2 border-gray-200 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-[#d32f2f] pt-4 pb-1 resize-none"
                ></textarea>
                <label className="absolute left-0 top-4 text-sm text-gray-500 transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#d32f2f] peer-valid:text-xs peer-valid:top-1">
                  Açıklama*
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-[#d32f2f] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors"
              >
                Kapat
              </button>
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
