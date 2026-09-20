"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, Info, X } from "lucide-react";

export default function IntegrationMenuOperationsView() {
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown states
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  // Status Checkboxes
  const [statusAktif, setStatusAktif] = useState(true);
  const [statusPasif, setStatusPasif] = useState(true);

  // Click outside handlers
  const statusRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setIsStatusOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-[#edf0f5] p-4 md:p-6 select-none overflow-y-auto">
      {/* Top Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 relative">
        <div className="flex-1 flex gap-2">
          {/* Search Input */}
          <div className="relative flex-1 max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Ürün Ara"
              className="block w-full pl-10 pr-3 py-2.5 border border-transparent rounded-full leading-5 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-[#b84c46] focus:border-[#b84c46] sm:text-sm transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Button */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="w-[42px] h-[42px] flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full text-gray-700 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            {/* Filter Popover */}
            {isFilterOpen && (
              <div className="absolute top-14 left-0 w-[420px] bg-white rounded-lg shadow-xl border border-gray-100 z-50 p-6">
                <div className="flex flex-col gap-6">
                  {/* Pazar Yeri */}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-gray-800 w-32">Pazar Yeri:</span>
                    <div className="relative flex-1">
                      <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b84c46] focus:border-[#b84c46] text-sm">
                        <option value="">Pazar Yerleri</option>
                        <option value="yemeksepeti">Yemeksepeti</option>
                        <option value="getir">Getir Yemek</option>
                        <option value="trendyol">Trendyol Yemek</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Ürün Kategorisi */}
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-sm text-gray-800 w-32">Ürün Kategorisi:</span>
                    <div className="relative flex-1">
                      <select className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2.5 px-4 rounded-md focus:outline-none focus:ring-1 focus:ring-[#b84c46] focus:border-[#b84c46] text-sm">
                        <option value="">Kategoriler</option>
                        <option value="ana-yemek">Ana Yemek</option>
                        <option value="icecek">İçecekler</option>
                        <option value="tatli">Tatlılar</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="text-[#b84c46] hover:text-[#a0403b] font-semibold text-sm cursor-pointer"
                    >
                      Temizle
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen(false)}
                      className="px-6 py-2 bg-[#b84c46] hover:bg-[#a0403b] text-white rounded-full font-semibold text-sm cursor-pointer transition-colors"
                    >
                      Uygula
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Dropdown */}
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#b84c46] text-[#b84c46] bg-[#fdf2f2] hover:bg-[#fce8e8] font-semibold text-sm transition-colors cursor-pointer"
            >
              <span>
                Ürün Durumu: {statusAktif && statusPasif ? "Aktif, Pasif" : statusAktif ? "Aktif" : statusPasif ? "Pasif" : "Yok"}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isStatusOpen && (
              <div className="absolute top-12 left-0 w-48 bg-white rounded-md shadow-lg border border-gray-100 z-40 py-2">
                <label className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Aktif</span>
                  <input
                    type="checkbox"
                    checked={statusAktif}
                    onChange={(e) => setStatusAktif(e.target.checked)}
                    className="h-4 w-4 text-[#b84c46] rounded focus:ring-[#b84c46] border-gray-300"
                  />
                </label>
                <label className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <span className="text-sm text-gray-700">Pasif</span>
                  <input
                    type="checkbox"
                    checked={statusPasif}
                    onChange={(e) => setStatusPasif(e.target.checked)}
                    className="h-4 w-4 text-[#b84c46] rounded focus:ring-[#b84c46] border-gray-300"
                  />
                </label>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsBrandModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#b84c46] hover:bg-[#a0403b] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
          >
            <span>Marka Seç</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Message */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700">
          Tüm markalarınıza ait ürünler listelenmiştir. Burada, yalnızca ürün durum değişikliğini destekleyen entegratörlere yönelik işlem yapılabilmektedir.
        </p>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1 max-h-[600px]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#f8f9fa]">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider w-12"
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#b84c46] focus:ring-[#b84c46] border-gray-300 rounded"
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Ürün Adı
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Entegrasyon
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Fiyat
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  Satışa Açık/Kapalı
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Empty State Row */}
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center bg-[#fafafa]">
                  <div className="flex items-center justify-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#b84c46] text-white flex items-center justify-center shrink-0">
                      <Info className="w-4 h-4" />
                    </div>
                    <span className="text-[13px] font-medium text-gray-700">
                      Ekranda gösterilecek veri bulunamadı. Marka seçimi ve uygulanan filtreleri kontrol ediniz.
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Brand Selection Modal */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-bold text-gray-800">Marka Seçimi</h2>
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="text-[#b84c46] hover:bg-gray-100 p-1 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-2">
              <p className="text-sm text-gray-500 mb-6">
                Ürünlerinizin listeleceği markayı seçiniz.
              </p>

              <div className="relative mb-6 border-b border-[#b84c46]">
                <input
                  type="text"
                  placeholder="Arama"
                  className="w-full py-2 outline-none text-gray-700 text-sm"
                />
                <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
              </div>

              <div className="max-h-[200px] overflow-y-auto mb-6">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="brand"
                    className="w-4 h-4 text-[#b84c46] focus:ring-[#b84c46] border-gray-300"
                    defaultChecked
                  />
                  <span className="text-sm text-gray-700 font-medium">Ana Kanal</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="text-[#b84c46] hover:text-[#a0403b] font-semibold text-sm cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="px-6 py-2 bg-[#b84c46] hover:bg-[#a0403b] text-white rounded-full font-semibold text-sm cursor-pointer transition-colors shadow-sm"
              >
                Seç
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
