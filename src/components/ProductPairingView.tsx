"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, Info, List, X, Undo2, Save, ChevronDown } from "lucide-react";

export default function ProductPairingView() {
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [adisyoSearch, setAdisyoSearch] = useState("");
  const [showPairedIntegration, setShowPairedIntegration] = useState(false);
  const [showPairedAdisyo, setShowPairedAdisyo] = useState(false);

  // Modal and Popover States
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
  const [isAutoAddPopoverOpen, setIsAutoAddPopoverOpen] = useState(false);

  // Form States for Auto Add Popover
  const [removeExistingPairs, setRemoveExistingPairs] = useState(false);

  // Click outside handler for popover
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsAutoAddPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 h-full flex-1 bg-[#edf0f5] overflow-y-auto">
      {/* Left Column: Entegrasyon Ürünleri */}
      <div className="flex-1 bg-[#f4f6f9] border border-gray-200 rounded shadow-sm flex flex-col h-full min-h-[600px]">
        {/* Header Section */}
        <div className="p-5 flex flex-col xl:flex-row xl:items-start justify-between gap-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#e2574c] rounded text-white flex items-center justify-center shadow-sm shrink-0">
              <List className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-gray-800">Entegrasyon Ürünleri</h2>
              <p className="text-sm text-gray-500">Entegrasyondaki ürünlerin listesi</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative">
            <button
              type="button"
              onClick={() => setIsIntegrationModalOpen(true)}
              className="px-4 py-2 bg-[#709fc5] hover:bg-[#5b8eb8] text-white text-sm font-medium rounded transition-colors shadow-sm cursor-pointer"
            >
              Entegrasyon Değiştir
            </button>
            <div className="relative" ref={popoverRef}>
              <button
                type="button"
                onClick={() => setIsAutoAddPopoverOpen(!isAutoAddPopoverOpen)}
                className="px-4 py-2 bg-[#df2c6c] hover:bg-[#c61f5b] text-white text-sm font-medium rounded transition-colors shadow-sm cursor-pointer"
              >
                Ürünleri Otomatik Ekle
              </button>
              
              {/* Auto Add Popover */}
              {isAutoAddPopoverOpen && (
                <div className="absolute top-12 left-0 w-[300px] bg-white rounded-lg shadow-xl border border-gray-200 z-40 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500 font-medium">Ürün KDV Grubu</label>
                      <div className="relative border-b border-gray-300 pb-1 hover:border-gray-400 focus-within:border-[#b84c46] transition-colors">
                        <select className="w-full appearance-none bg-transparent outline-none text-sm text-gray-800 cursor-pointer pr-6">
                          <option value="yiyecek">Yiyecek (%10)</option>
                          <option value="icecek">İçecek (%20)</option>
                        </select>
                        <ChevronDown className="absolute right-0 top-0.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <label className="flex items-center gap-2 cursor-pointer mt-1">
                      <input
                        type="checkbox"
                        checked={removeExistingPairs}
                        onChange={(e) => setRemoveExistingPairs(e.target.checked)}
                        className="w-4 h-4 text-[#df3232] border-gray-300 rounded focus:ring-[#df3232]"
                      />
                      <span className="text-sm text-gray-700 font-medium">Mevcut eşleşmeleri kaldır</span>
                    </label>

                    <div className="flex items-center justify-end gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => setIsAutoAddPopoverOpen(false)}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[#df3232] hover:bg-gray-50 rounded font-medium text-sm transition-colors cursor-pointer"
                      >
                        <Undo2 className="w-4 h-4" />
                        İptal
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsAutoAddPopoverOpen(false)}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#df3232] hover:bg-[#c22b2b] text-white rounded font-medium text-sm transition-colors shadow-sm cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        Kaydet
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-5">
          {/* Warning Banner */}
          <div className="flex items-center gap-3 p-4 bg-[#f8f9fa] border border-gray-200 rounded">
            <div className="w-6 h-6 rounded-full bg-[#b84c46] text-white flex items-center justify-center shrink-0">
              <Info className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-gray-800">
              Yapacağınız eşleştirmeler merkezi olarak yapılacaktır!
            </span>
          </div>

          {/* Search Input */}
          <div className="relative border-b border-gray-300 pb-1 mt-2">
            <input
              type="text"
              placeholder="Arama"
              value={integrationSearch}
              onChange={(e) => setIntegrationSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPairedIntegration}
                onChange={(e) => setShowPairedIntegration(e.target.checked)}
                className="w-4 h-4 text-[#b84c46] border-gray-300 rounded focus:ring-[#b84c46]"
              />
              <span className="text-sm font-medium text-gray-700">Eşleştirilmiş Ürünleri Göster</span>
            </label>
            <span className="text-xs text-gray-500 font-medium">0 adet kayıt bulundu</span>
          </div>

          {/* Empty State */}
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-700">Bütün ürünler eşleştirilmiştir</p>
          </div>
        </div>
      </div>

      {/* Right Column: Adisyo Ürünler */}
      <div className="flex-1 bg-[#f4f6f9] border border-gray-200 rounded shadow-sm flex flex-col h-full min-h-[600px]">
        {/* Header Section */}
        <div className="p-5 flex items-start gap-4 border-b border-gray-200">
          <div className="w-14 h-14 bg-[#e2574c] rounded text-white flex items-center justify-center shadow-sm shrink-0">
            <List className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-gray-800">Adisyo Ürünler</h2>
            <p className="text-sm text-gray-500">Adisyo Ürün Listesi</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-5">
          {/* Search Input */}
          <div className="relative border-b border-gray-300 pb-1 mt-2">
            <input
              type="text"
              placeholder="Arama"
              value={adisyoSearch}
              onChange={(e) => setAdisyoSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-gray-700 placeholder-gray-500 pr-8"
            />
            <Search className="absolute right-0 top-0 w-4 h-4 text-gray-400" />
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPairedAdisyo}
                onChange={(e) => setShowPairedAdisyo(e.target.checked)}
                className="w-4 h-4 text-[#b84c46] border-gray-300 rounded focus:ring-[#b84c46]"
              />
              <span className="text-sm font-medium text-gray-400">Eşleştirilmiş Ürünleri Göster</span>
            </label>
          </div>

          {/* Empty State / List */}
          <div className="pt-2">
            {/* List will be rendered here */}
          </div>
        </div>
      </div>

      {/* Integration Selection Modal */}
      {isIntegrationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col">
            <div className="flex flex-col items-center justify-center py-10 relative">
              <button
                type="button"
                onClick={() => setIsIntegrationModalOpen(false)}
                className="absolute top-4 right-4 text-[#df3232] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h2 className="text-xl font-bold text-gray-800 mb-2">Entegrasyonlar</h2>
              <p className="text-sm text-gray-600 font-medium">Lütfen eşleştirme yapacağınız entegrasyonu seçiniz</p>
              
              {/* Action Buttons in Modal Body (Based on screenshot UI) */}
              <div className="flex items-center justify-end w-full px-8 mt-16 gap-4">
                <button
                  type="button"
                  onClick={() => setIsIntegrationModalOpen(false)}
                  className="px-6 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={() => setIsIntegrationModalOpen(false)}
                  className="px-6 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white font-bold text-sm rounded shadow-sm cursor-pointer transition-colors"
                >
                  Devam Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
