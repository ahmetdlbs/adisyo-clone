"use client";

import React, { useState } from "react";
import { Receipt, Plus, X } from "lucide-react";

interface UnitItem {
  id: string;
  name: string;
}

const initialUnits: UnitItem[] = [
  { id: "1", name: "Tam" },
  { id: "2", name: "Yarım" },
  { id: "3", name: "Bir buçuk" },
  { id: "4", name: "Adet" },
  { id: "5", name: "Kg" },
];

export default function ProductUnitsView() {
  const [units, setUnits] = useState<UnitItem[]>(initialUnits);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitItem | null>(null);
  const [unitName, setUnitName] = useState("");

  const handleOpenNew = () => {
    setEditingUnit(null);
    setUnitName("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (unit: UnitItem) => {
    setEditingUnit(unit);
    setUnitName(unit.name);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setUnits(units.filter((u) => u.id !== id));
  };

  const handleSave = () => {
    if (!unitName.trim()) return;

    if (editingUnit) {
      setUnits(
        units.map((u) => (u.id === editingUnit.id ? { ...u, name: unitName } : u))
      );
    } else {
      setUnits([
        ...units,
        { id: Date.now().toString(), name: unitName },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] p-6 overflow-hidden select-none relative">
      <div className="flex-1 bg-white border border-[#d8dde4] rounded-md shadow-sm flex flex-col relative overflow-hidden mt-6">
        
        {/* Header Section with Overlapping Icon */}
        <div className="px-8 pt-8 pb-4 relative border-b border-gray-100">
          {/* Floating Orange Icon */}
          <div className="absolute -top-6 left-6 w-[70px] h-[70px] bg-[#df662e] rounded-md shadow-sm flex items-center justify-center text-white z-10">
            <Receipt className="w-8 h-8" />
          </div>

          <div className="ml-[80px] flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-medium text-[#2b2f36] leading-tight">
                Porsiyon/Birim Yönetimi
              </h1>
              <p className="text-[13px] text-gray-500 mt-1 max-w-3xl leading-snug">
                Bu ekranda ürünler için kullanılacak porsiyonlar (örneğin tam, yarım, double vb.) tanımlanır. Ardından <span className="text-[#3b82f6] cursor-pointer hover:underline">Menü/Ürünler</span> ekranında ilgili ürün seçilerek, bu porsiyonlardan istenen ürüne atanır. Böylece aynı ürün farklı porsiyon seçenekleriyle satışa sunulabilir.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenNew}
              className="bg-[#c63131] hover:bg-[#a82a2a] text-white px-4 py-2 rounded-[4px] font-medium text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni</span>
            </button>
          </div>
        </div>

        {/* Table List */}
        <div className="flex-1 overflow-auto px-8 py-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 uppercase tracking-wide">BİRİM ADI</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 uppercase tracking-wide text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody>
              {units.map((unit) => (
                <tr key={unit.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                  <td className="py-4 px-2 text-[14px] text-gray-800">{unit.name}</td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end gap-3 text-[13px]">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(unit)}
                        className="text-[#c63131] hover:underline cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(unit.id)}
                        className="text-[#c63131] hover:underline cursor-pointer"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-md shadow-xl w-[500px] overflow-hidden flex flex-col transform transition-all">
            {/* Modal Header */}
            <div className="px-6 py-5 flex items-start justify-between relative border-b border-transparent">
              <div>
                <h2 className="text-xl font-medium text-[#2b2f36]">Birim Tanımla</h2>
                <p className="text-sm text-gray-500 mt-1">Yeni birim bilgilerini giriniz.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#c63131] p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6 pb-20 relative">
              <div className="relative pt-4">
                <input
                  type="text"
                  value={unitName}
                  onChange={(e) => setUnitName(e.target.value)}
                  className="block w-full border-0 border-b border-gray-300 bg-transparent text-gray-900 focus:ring-0 focus:border-[#df3232] peer py-1 text-[15px]"
                  placeholder=" "
                  autoFocus
                />
                <label className="absolute text-[15px] text-gray-500 duration-300 transform -translate-y-6 scale-75 top-5 z-0 origin-[0] peer-focus:left-0 peer-focus:text-[#df3232] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 pointer-events-none">
                  Birim Adı<span className="text-red-500">*</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex justify-end pb-6">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#df3232] hover:bg-[#c62c2c] text-white px-6 py-2 rounded font-medium text-sm shadow-sm transition-colors cursor-pointer"
              >
                {editingUnit ? "Güncelle" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
