"use client";

import React, { useState } from "react";
import { Download, Save, SlidersHorizontal, Table as TableIcon, BarChart3, MoreVertical, ArrowUpDown, Filter, ChevronRight } from "lucide-react";

export default function ReportingWizardView() {
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const MOCK_DATA = [
    { group: "Çay", value: "2" },
    { group: "Salep", value: "-" },
    { group: "Ayran", value: "-" },
    { group: "Coca Cola", value: "-" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f3f4f6] p-6">
      
      {/* Top Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header Section */}
        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100">
          
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-gray-800">Rapor Sihirbazı</h1>
            
            <div className="h-10 w-px bg-gray-200 hidden md:block"></div>
            
            <div className="flex items-center gap-3">
              <div className="bg-red-50 p-2 rounded flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">KAYITLI RAPOR</span>
                <span className="text-[15px] font-bold text-gray-800 leading-tight">Kanal Bazlı<br/>Ürün Satışı</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-500 rounded font-medium hover:bg-red-50 transition-colors">
              <Download size={18} />
              <span>Excel</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-red-100 text-red-500 rounded font-medium hover:bg-red-50 transition-colors">
              <Save size={18} />
              <span>Kaydet</span>
            </button>
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white rounded font-medium transition-colors shadow-sm"
            >
              <SlidersHorizontal size={18} />
              <span>Raporu Düzenle</span>
            </button>
          </div>
        </div>

        {/* Configuration Bar */}
        <div className="bg-[#f8f9fa] p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 tracking-wider">SATIR:</span>
              <span className="px-3 py-1 bg-gray-200/70 text-gray-700 rounded-full text-sm font-medium">Ürün</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 tracking-wider">SÜTUN:</span>
              <span className="px-3 py-1 bg-gray-200/70 text-gray-700 rounded-full text-sm font-medium">Sipariş Kanalı</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500 tracking-wider">DEĞER:</span>
              <span className="px-3 py-1 bg-[#e0e7ff] text-[#4338ca] rounded-full text-sm font-medium">Miktar</span>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
            <button 
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "table" ? "bg-white text-red-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <TableIcon size={20} />
            </button>
            <button 
              onClick={() => setViewMode("chart")}
              className={`p-1.5 rounded-md transition-colors ${viewMode === "chart" ? "bg-white text-red-500 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            >
              <BarChart3 size={20} />
            </button>
          </div>
        </div>

        {/* Data Table */}
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9fafb] text-gray-600 border-b border-gray-200">
                  <th className="p-3 font-medium text-sm border-r border-gray-200 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer">
                        Grup
                        <ArrowUpDown size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <button className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </th>
                  <th className="p-3 font-medium text-sm group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 cursor-pointer">
                        Gel Al Siparişi
                        <ArrowUpDown size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                          <Filter size={16} />
                        </button>
                        <button className="text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_DATA.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-sm text-gray-800 font-medium border-r border-gray-100">
                      {row.group}
                    </td>
                    <td className="p-3 text-sm text-gray-800 font-medium">
                      {row.value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <div className="h-64 flex items-end gap-6 justify-center mt-8 border-b border-gray-300 pb-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-[#3b82f6] rounded-t-sm" style={{ height: "180px" }}></div>
                <span className="text-xs text-gray-600 font-medium">Çay</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-[#10b981] rounded-t-sm" style={{ height: "40px" }}></div>
                <span className="text-xs text-gray-600 font-medium">Salep</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-[#f59e0b] rounded-t-sm" style={{ height: "80px" }}></div>
                <span className="text-xs text-gray-600 font-medium">Ayran</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 bg-[#ef4444] rounded-t-sm" style={{ height: "120px" }}></div>
                <span className="text-xs text-gray-600 font-medium">Coca Cola</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div><span>Çay (42%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div><span>Salep (10%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div><span>Ayran (20%)</span></div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div><span>Coca Cola (28%)</span></div>
            </div>
          </div>
        )}
      </div>

      {/* Raporu Düzenle Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[400px] bg-[#f8f9fa] shadow-2xl h-full flex flex-col transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <div className="flex items-center gap-2 text-gray-800">
                <SlidersHorizontal size={18} className="text-red-500" />
                <h2 className="text-[16px] font-medium">Rapor Ayarları</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-gray-500 hover:bg-gray-100 p-1.5 rounded-md transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 bg-white px-6">
              <button className="px-4 py-3 text-sm font-medium text-red-500 border-b-2 border-red-500">
                Sütunlar
              </button>
              <button className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">
                Filtreler
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto px-6 py-4 flex flex-col gap-6">
              
              {/* MEVCUT ALANLAR */}
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">MEVCUT ALANLAR</h3>
                <div className="flex flex-col gap-3">
                  {["Tarih", "Ay ve Yıl", "Ay", "Hafta Günü", "Kategori", "Birim", "Bölge", "Garson", "Kurye", "Ödeme Tipi"].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm text-gray-700">
                      <div className="grid grid-cols-2 gap-[2px] opacity-30 cursor-grab">
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      </div>
                      <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SATIRLAR */}
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">SATIRLAR (HİYERARŞİK)</h3>
                <div className="p-3 border border-dashed border-gray-300 bg-white rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                    <div className="grid grid-cols-2 gap-[2px] opacity-30 cursor-grab">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 font-normal">1.</span>
                    <span>Ürün</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>

              {/* SÜTUNLAR */}
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">SÜTUNLAR</h3>
                <div className="p-3 border border-dashed border-gray-300 bg-white rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm text-gray-800 font-medium">
                    <div className="grid grid-cols-2 gap-[2px] opacity-30 cursor-grab">
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                    </div>
                    <span>Sipariş Kanalı</span>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>

              {/* DEĞERLER */}
              <div>
                <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3">Σ DEĞERLER</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <div className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center"></div>
                    <span>Sipariş Sayısı</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <div className="w-4 h-4 rounded bg-gray-300 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span>Miktar</span>
                  </label>
                  <label className="flex items-center gap-3 text-sm text-gray-700 cursor-pointer">
                    <div className="w-4 h-4 rounded border border-gray-300 bg-white flex items-center justify-center"></div>
                    <span>Brüt Tutar</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6 flex flex-col gap-3 bg-[#f8f9fa]">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2.5 text-[14px] font-medium text-white bg-[#dc3545] rounded shadow-sm hover:bg-red-700 transition-colors"
              >
                Raporu Güncelle
              </button>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2.5 text-[14px] font-medium text-red-500 bg-transparent rounded hover:bg-red-50 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
