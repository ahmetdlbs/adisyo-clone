"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  ClipboardList,
  Plus,
  Search,
  FilterX,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Save,
  Clock,
  AlertTriangle,
  PackageX,
  Calendar,
} from "lucide-react";

type ViewMode = "list" | "new-entry";

export default function StockListView() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="w-full max-w-[1200px] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col relative h-[calc(100vh-100px)]">
        
        {/* Header Section */}
        <div className="p-6 border-b border-gray-100 flex flex-col gap-4 shrink-0 relative z-10 bg-white rounded-t-xl">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-[#f97316] rounded-xl flex items-center justify-center text-white shrink-0 shadow-md">
                <FileText className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {viewMode === "list" ? "Stok Listesi" : "Stok Giriş İşlemleri"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {viewMode === "list"
                    ? "Stok hareketlerini bu ekrandan detaylıca takip edebilirsiniz."
                    : "Yeni ürün alımlarını sisteme işlemek ve maliyet takibi yapmak için bu ekranı kullanabilirsiniz."}
                </p>
              </div>
            </div>

            {/* Top Right Action Buttons */}
            <div className="flex items-center gap-3">
              {viewMode === "list" ? (
                <>
                  <button className="flex items-center gap-2 px-4 py-2 text-[#d32f2f] hover:bg-red-50 font-medium text-sm rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    İndir
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-medium text-sm rounded-lg transition-colors shadow-sm">
                    <ClipboardList className="w-4 h-4" />
                    Stok Sayımı
                  </button>
                  <button 
                    onClick={() => setViewMode("new-entry")}
                    className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    Yeni Stok Girişi
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setViewMode("list")}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 font-medium text-sm rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Geri
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#e57373] text-white font-medium text-sm rounded-lg cursor-not-allowed opacity-80">
                    <Save className="w-4 h-4" />
                    İşlemleri Kaydet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col">
          {viewMode === "list" ? (
            <div className="flex flex-col h-full">
              {/* Filters */}
              <div className="p-6 bg-white border-b border-gray-100 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white"
                  />
                  <label className="absolute left-9 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Başlangıç Tarihi
                  </label>
                </div>
                
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <input
                    type="date"
                    className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white"
                  />
                  <label className="absolute left-9 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    Bitiş Tarihi
                  </label>
                </div>

                <div className="relative">
                  <select className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white appearance-none">
                    <option>Hepsi</option>
                    <option>Stok Girişi</option>
                    <option>Stok Çıkışı</option>
                  </select>
                  <label className="absolute left-4 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                    İşlem Tipi
                  </label>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                
                <div className="relative col-span-1 lg:col-span-2 flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      placeholder="Fatura no..."
                      className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white placeholder-transparent focus:placeholder-gray-400"
                    />
                    <label className="absolute left-9 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Fatura No Sorgula
                    </label>
                  </div>
                  <button className="h-12 px-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                    <FilterX className="w-4 h-4" />
                    <span className="ml-2 text-sm font-medium">Temizle</span>
                  </button>
                </div>
              </div>

              {/* Table Header */}
              <div className="px-6 py-4 grid grid-cols-7 gap-4 bg-white border-b border-gray-100 text-sm font-semibold text-gray-600">
                <div>No</div>
                <div>Fatura No</div>
                <div>İşlem Tipi</div>
                <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  İşlem Tarihi <span className="text-gray-400 text-[10px]">↕</span>
                </div>
                <div>Gelir Merkezi</div>
                <div>Kullanıcı</div>
                <div className="text-right">İşlemler</div>
              </div>

              {/* Table Body - Empty State */}
              <div className="flex-1 flex items-start justify-center p-6 bg-[#f8fafc]">
                <div className="w-full bg-[#f1f5f9] rounded-lg p-4 text-sm text-gray-600 text-left border border-gray-200">
                  Herhangi bir kayıt bulunamadı.
                </div>
              </div>

              {/* Pagination */}
              <div className="p-4 bg-white border-t border-gray-100 flex justify-end shrink-0">
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-medium">1 / 1</span>
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-400 cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full bg-white">
              
              {/* Form Fields */}
              <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="date"
                      className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg pl-9 pr-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white"
                    />
                    <label className="absolute left-9 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Fatura Tarihi
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Örn: FT-2024"
                      className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white placeholder-transparent focus:placeholder-gray-400"
                    />
                    <label className="absolute left-4 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Fatura No
                    </label>
                  </div>

                  <div className="relative">
                    <select className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white appearance-none">
                      <option>Nakit</option>
                      <option>Kredi Kartı</option>
                    </select>
                    <label className="absolute left-4 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Ödeme Tipi
                    </label>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="İşlem ile ilgili notlar..."
                      className="peer w-full h-12 bg-[#f8fafc] border border-gray-200 rounded-lg px-4 pt-4 pb-1 text-sm text-gray-900 outline-none transition-all hover:bg-gray-50 focus:border-[#d32f2f] focus:bg-white placeholder-transparent focus:placeholder-gray-400"
                    />
                    <label className="absolute left-4 top-2 text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                      Açıklama
                    </label>
                  </div>
                </div>

                {/* Sub Action Buttons */}
                <div className="flex justify-end gap-3 mt-2">
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <Clock className="w-4 h-4" />
                    Değişiklikleri gör
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                    <AlertTriangle className="w-4 h-4" />
                    Kritik seviyenin altındakileri göster
                  </button>
                </div>
              </div>

              {/* Main Content - Empty State */}
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#f8fafc]">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-[#d32f2f] mb-4">
                  <PackageX className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Stok takibi aktif ürün bulunamadı</h3>
                <p className="text-sm text-gray-500 text-center max-w-md leading-relaxed">
                  Stok Girişi yapabilmek için önce{" "}
                  <span className="text-[#d32f2f] font-medium underline underline-offset-2 cursor-pointer">
                    Tanımlamalar &gt; Menü Ürünler
                  </span>{" "}
                  ekranından ilgili ürünlerde "Stok Takibi" parametresini aktif etmeniz gerekiyor.
                </p>
              </div>

              {/* Bottom Totals Bar */}
              <div className="h-[72px] bg-[#f8fafc] border-t border-gray-100 flex items-center justify-end px-8 shrink-0 divide-x divide-gray-200">
                <div className="px-8 text-right flex flex-col items-end">
                  <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Toplam Stok Girişi</span>
                  <span className="text-2xl font-bold text-gray-900">0 Adet</span>
                </div>
                <div className="px-8 text-right flex flex-col items-end">
                  <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Toplam Fatura Tutarı</span>
                  <span className="text-2xl font-bold text-[#d32f2f]">0 ₺</span>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
