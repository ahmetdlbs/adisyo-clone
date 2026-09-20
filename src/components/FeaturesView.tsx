"use client";

import React, { useState } from "react";
import { Search, ChevronDown, Trash2, X, Check } from "lucide-react";

interface FeatureOption {
  id: string;
  name: string;
  price: number;
  isDefault: boolean;
}

interface FeatureGroup {
  id: string;
  name: string;
  selectionType: "Tekli Seçim" | "Çoklu Seçim";
  useRecipeProduct: boolean;
  isRequired: boolean;
  options: FeatureOption[];
}

const initialGroups: FeatureGroup[] = [
  {
    id: "1",
    name: "Genel",
    selectionType: "Çoklu Seçim",
    useRecipeProduct: false,
    isRequired: false,
    options: Array(19).fill(null).map((_, i) => ({
      id: `opt-${i}`,
      name: `Option ${i}`,
      price: 0,
      isDefault: false
    }))
  }
];

export default function FeaturesView() {
  const [groups, setGroups] = useState<FeatureGroup[]>(initialGroups);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<FeatureGroup | null>(null);

  // Form State
  const [groupName, setGroupName] = useState("");
  const [selectionType, setSelectionType] = useState<"Tekli Seçim" | "Çoklu Seçim">("Tekli Seçim");
  const [useRecipeProduct, setUseRecipeProduct] = useState(false);
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState<FeatureOption[]>([
    { id: "new-0", name: "", price: 0, isDefault: false }
  ]);

  const handleOpenNew = () => {
    setEditingGroup(null);
    setGroupName("");
    setSelectionType("Tekli Seçim");
    setUseRecipeProduct(false);
    setIsRequired(false);
    setOptions([{ id: `new-${Date.now()}`, name: "", price: 0, isDefault: false }]);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (group: FeatureGroup) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setSelectionType(group.selectionType);
    setUseRecipeProduct(group.useRecipeProduct);
    setIsRequired(group.isRequired);
    setOptions(group.options.length > 0 ? group.options : [{ id: `new-${Date.now()}`, name: "", price: 0, isDefault: false }]);
    setIsDrawerOpen(true);
  };

  const handleDeleteGroup = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id));
  };

  const handleSave = () => {
    if (!groupName.trim()) return;

    const validOptions = options.filter(o => o.name.trim() !== "");

    if (editingGroup) {
      setGroups(
        groups.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name: groupName, selectionType, useRecipeProduct, isRequired, options: validOptions }
            : g
        )
      );
    } else {
      setGroups([
        ...groups,
        {
          id: Date.now().toString(),
          name: groupName,
          selectionType,
          useRecipeProduct,
          isRequired,
          options: validOptions
        }
      ]);
    }
    setIsDrawerOpen(false);
  };

  const updateOption = (id: string, field: keyof FeatureOption, value: any) => {
    setOptions(options.map(opt => {
      if (opt.id === id) {
        return { ...opt, [field]: value };
      }
      return opt;
    }));
  };

  const addOptionRow = () => {
    setOptions([...options, { id: `new-${Date.now()}`, name: "", price: 0, isDefault: false }]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] p-6 overflow-hidden select-none relative">
      <div className="flex-1 bg-white border border-[#d8dde4] rounded-md shadow-sm flex flex-col overflow-hidden">
        
        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="relative w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Arama..."
              className="w-full pl-9 pr-4 py-2 border-0 bg-gray-50 focus:bg-white text-sm outline-none rounded-md transition-colors placeholder:text-gray-400 text-gray-700"
            />
          </div>
          <button
            onClick={handleOpenNew}
            className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-4 py-2 rounded-md font-medium text-[13px] shadow-sm transition-colors cursor-pointer"
          >
            Yeni Grup Tanımla
          </button>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f3f4f6]">
                <th className="py-3 px-4 text-[13px] font-semibold text-gray-800 rounded-l-md">Özellik grup ismi</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-gray-800">Seçim tipi</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-gray-800">Özellikler</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-gray-800">İşlemler</th>
                <th className="py-3 px-4 text-[13px] font-semibold text-gray-800 text-center rounded-r-md">Sil</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-[14px] text-gray-800">{group.name}</td>
                  <td className="py-4 px-4 text-[14px] text-gray-800">{group.selectionType}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 text-[14px] text-gray-700">
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                      <span className="text-[#d32f2f] font-medium">{group.options.length}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4 text-[13px]">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(group)}
                        className="text-[#d32f2f] hover:underline cursor-pointer font-medium"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(group)}
                        className="text-[#d32f2f] hover:underline cursor-pointer font-medium"
                      >
                        Yeni özellik ekle
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteGroup(group.id)}
                      className="text-[#d32f2f] hover:text-red-800 cursor-pointer p-1"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Side Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[600px] bg-[#f8f9fa] shadow-2xl h-full flex flex-col transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
              <h2 className="text-[16px] font-medium text-gray-800">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#d32f2f] hover:bg-red-50 p-1.5 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto p-6 flex flex-col gap-5">
              {/* Feature Group Name */}
              <div className="relative">
                <input
                  type="text"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className={`block w-full border ${!groupName ? 'border-[#d32f2f]' : 'border-gray-300'} rounded bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 peer px-3 py-2.5 text-[14px] outline-none`}
                  placeholder=" "
                />
                <label className={`absolute text-[12px] bg-white px-1 duration-300 transform -translate-y-1/2 top-0 left-2 ${!groupName ? 'text-[#d32f2f]' : 'text-gray-500'}`}>
                  Özellik grup ismi*
                </label>
              </div>

              {/* Selection Type */}
              <div className="relative mt-2">
                <select
                  value={selectionType}
                  onChange={(e) => setSelectionType(e.target.value as any)}
                  className="block w-full border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 peer px-3 py-2.5 text-[14px] outline-none appearance-none"
                >
                  <option value="Tekli Seçim">Tekli Seçim</option>
                  <option value="Çoklu Seçim">Çoklu Seçim</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label className="absolute text-[12px] text-gray-500 bg-[#f8f9fa] px-1 duration-300 transform -translate-y-1/2 top-0 left-2">
                  Seçim tipi
                </label>
              </div>

              {/* Toggles */}
              <div className="flex flex-col gap-4 mt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={useRecipeProduct}
                      onChange={(e) => setUseRecipeProduct(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${useRecipeProduct ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${useRecipeProduct ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-[14px] text-gray-800">Reçeteli ürün kullan</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={isRequired}
                      onChange={(e) => setIsRequired(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isRequired ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isRequired ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-[14px] text-gray-800">Özellik seçimi zorunlu olsun</span>
                </label>
              </div>

              {/* Options Table inside Drawer */}
              <div className="mt-4 flex flex-col gap-2">
                <div className="grid grid-cols-[1fr_120px_80px] gap-4 px-2">
                  <span className="text-[13px] font-semibold text-gray-800">Özellik Adı</span>
                  <span className="text-[13px] font-semibold text-gray-800">Ekstra Tutar</span>
                  <span className="text-[13px] font-semibold text-gray-800 text-center">Varsayılan</span>
                </div>

                <div className="flex flex-col gap-3">
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="grid grid-cols-[1fr_120px_80px] gap-4 items-center bg-white p-3 rounded border border-transparent shadow-sm">
                      <div className="relative">
                        <input
                          type="text"
                          value={opt.name}
                          onChange={(e) => {
                            updateOption(opt.id, "name", e.target.value);
                            // Auto add next row if typing in the last one
                            if (idx === options.length - 1 && e.target.value.trim() !== "") {
                              addOptionRow();
                            }
                          }}
                          className="block w-full border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 px-3 py-2 text-[14px] outline-none"
                          placeholder="Özellik Adı*"
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={opt.price}
                          onChange={(e) => updateOption(opt.id, "price", parseFloat(e.target.value) || 0)}
                          className="block w-full border border-gray-300 rounded bg-white text-gray-900 focus:ring-1 focus:ring-blue-500 px-3 py-2 pr-6 text-[14px] outline-none"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-[13px]">₺</span>
                        <label className="absolute text-[10px] text-gray-500 bg-white px-1 duration-300 transform -translate-y-1/2 top-0 left-2">
                          Ekstra Tutar*
                        </label>
                      </div>
                      <div className="flex justify-center">
                        <input 
                          type="checkbox"
                          checked={opt.isDefault}
                          onChange={(e) => updateOption(opt.id, "isDefault", e.target.checked)}
                          className="w-5 h-5 border-gray-300 rounded text-[#d32f2f] focus:ring-[#d32f2f] cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="border-t border-gray-200 p-4 bg-white flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#d32f2f] font-medium px-4 py-2 hover:bg-red-50 rounded transition-colors text-[14px]"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2 rounded font-medium text-[14px] shadow-sm transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
