"use client";

import React, { useState } from "react";
import { GripVertical, Percent, Save, Plus } from "lucide-react";

interface VatDefinition {
  id: string;
  name: string;
  rate: string;
  isDefault: boolean;
}

const initialVats: VatDefinition[] = [
  { id: "1", name: "İçecek", rate: "%10", isDefault: false },
  { id: "2", name: "Yiyecek", rate: "%10", isDefault: true },
];

export default function VatDefinitionsView() {
  const [vats, setVats] = useState<VatDefinition[]>(initialVats);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAdd = () => {
    if (vats.length >= 8) return; // Max 8 allowed
    const newVat: VatDefinition = {
      id: Date.now().toString(),
      name: "",
      rate: "",
      isDefault: vats.length === 0,
    };
    setVats([...vats, newVat]);
    setHasChanges(true);
  };

  const handleRemove = (id: string) => {
    setVats(vats.filter((v) => v.id !== id));
    setHasChanges(true);
  };

  const updateVat = (id: string, field: keyof VatDefinition, value: any) => {
    setVats(
      vats.map((v) => {
        if (v.id === id) {
          if (field === "isDefault" && value === true) {
            // Uncheck others if this one is set to default
            return { ...v, [field]: value };
          }
          return { ...v, [field]: value };
        }
        if (field === "isDefault" && value === true) {
          return { ...v, isDefault: false };
        }
        return v;
      })
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    // In a real app, API call goes here
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f6f8] p-6 overflow-auto select-none">
      <div className="max-w-6xl w-full mx-auto bg-white border border-[#e5e7eb] rounded-lg shadow-sm flex flex-col">
        {/* Header Section */}
        <div className="flex items-start justify-between p-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-[#e86c2e] rounded shadow-sm flex items-center justify-center shrink-0">
              <Percent className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1 max-w-2xl">
              <h2 className="text-[18px] font-semibold text-gray-800">Kdv Oranları</h2>
              <p className="text-[13px] text-gray-500 leading-snug">
                Ürün gruplarınıza ait KDV oranlarını bu alandan yönetebilirsiniz. Tanımları düzenleyebilir, yeni oranlar
                ekleyebilir veya ihtiyaç duymadıklarınızı kaldırabilirsiniz. Toplamda en fazla 8 farklı KDV tanımı
                oluşturabilirsiniz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleAdd}
              disabled={vats.length >= 8}
              className="flex items-center gap-1 text-[#d32f2f] hover:bg-red-50 px-3 py-2 rounded-md font-medium text-[14px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yeni KDV Grubu Ekle
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md font-medium text-[14px] shadow-sm transition-colors ${
                hasChanges
                  ? "bg-[#d32f2f] hover:bg-[#b71c1c] text-white cursor-pointer"
                  : "bg-[#e5a0a0] text-white cursor-not-allowed opacity-80"
              }`}
            >
              <Save className="w-4 h-4" />
              Kaydet
            </button>
          </div>
        </div>

        {/* List Section */}
        <div className="px-6 pb-8">
          {/* Table Header */}
          <div className="grid grid-cols-[80px_1fr_200px_100px_80px] gap-4 mb-2 px-4">
            <span className="text-[12px] font-semibold text-gray-600">SIRA NO</span>
            <span className="text-[12px] font-semibold text-gray-600">TANIM ADI</span>
            <span className="text-[12px] font-semibold text-gray-600">KDV ORANI</span>
            <span className="text-[12px] font-semibold text-gray-600 text-center">VARSAYILAN</span>
            <span className="text-[12px] font-semibold text-gray-600 text-center">İŞLEM</span>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-0 border border-gray-200 rounded-md overflow-hidden bg-white">
            {vats.map((vat, index) => (
              <div
                key={vat.id}
                className={`grid grid-cols-[80px_1fr_200px_100px_80px] gap-4 items-center p-3 relative border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors ${
                  vat.isDefault ? "" : ""
                }`}
              >
                {/* Red Left Strip if Default */}
                {vat.isDefault && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#d32f2f]" />
                )}

                {/* Sira No & Grip */}
                <div className="flex items-center gap-2 pl-2 text-gray-500">
                  <GripVertical className="w-4 h-4 cursor-grab" />
                  <span className="text-[14px] font-medium text-gray-700">{index + 1}</span>
                </div>

                {/* Tanim Adi (Material Outlined) */}
                <div className="relative">
                  <input
                    type="text"
                    value={vat.name}
                    onChange={(e) => updateVat(vat.id, "name", e.target.value)}
                    className="block w-full border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 peer px-3 py-2 text-[14px] outline-none"
                    placeholder=" "
                  />
                  <label className="absolute text-[11px] text-gray-500 bg-white px-1 duration-300 transform -translate-y-1/2 top-0 left-2 pointer-events-none">
                    Örn: Yiyecek, İçecek*
                  </label>
                </div>

                {/* KDV Orani (Material Outlined Select) */}
                <div className="relative">
                  <select
                    value={vat.rate}
                    onChange={(e) => updateVat(vat.id, "rate", e.target.value)}
                    className="block w-full border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:border-blue-500 focus:ring-blue-500 peer px-3 py-2 text-[14px] outline-none appearance-none"
                  >
                    <option value="">Seçiniz</option>
                    <option value="%0">%0</option>
                    <option value="%1">%1</option>
                    <option value="%8">%8</option>
                    <option value="%10">%10</option>
                    <option value="%18">%18</option>
                    <option value="%20">%20</option>
                  </select>
                  <label className="absolute text-[11px] text-gray-500 bg-white px-1 duration-300 transform -translate-y-1/2 top-0 left-2 pointer-events-none">
                    % KDV Oranı*
                  </label>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                {/* Varsayilan Checkbox */}
                <div className="flex justify-center">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={vat.isDefault}
                        onChange={(e) => updateVat(vat.id, "isDefault", e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#d32f2f] peer-checked:border-[#d32f2f] transition-all"></div>
                      <svg
                        className="absolute w-3.5 h-3.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </label>
                </div>

                {/* İşlem */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemove(vat.id)}
                    className="text-[#d32f2f] text-[13px] hover:underline font-medium p-1 cursor-pointer"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
            
            {vats.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-[14px]">
                Kayıt bulunamadı. Lütfen yeni bir KDV grubu ekleyin.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
