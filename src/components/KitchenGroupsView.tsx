"use client";

import React, { useState } from "react";
import { FileText, Plus, X } from "lucide-react";

interface KitchenGroup {
  id: string;
  name: string;
  hasCookingStage: boolean;
  hasPackagingStage: boolean;
}

const initialGroups: KitchenGroup[] = [
  {
    id: "1",
    name: "Mutfak",
    hasCookingStage: false,
    hasPackagingStage: false,
  },
];

export default function KitchenGroupsView() {
  const [groups, setGroups] = useState<KitchenGroup[]>(initialGroups);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<KitchenGroup | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [hasCookingStage, setHasCookingStage] = useState(false);
  const [hasPackagingStage, setHasPackagingStage] = useState(false);

  const handleOpenNew = () => {
    setEditingGroup(null);
    setName("");
    setHasCookingStage(false);
    setHasPackagingStage(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (group: KitchenGroup) => {
    setEditingGroup(group);
    setName(group.name);
    setHasCookingStage(group.hasCookingStage);
    setHasPackagingStage(group.hasPackagingStage);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setGroups(groups.filter((g) => g.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingGroup) {
      setGroups(
        groups.map((g) =>
          g.id === editingGroup.id
            ? { ...g, name, hasCookingStage, hasPackagingStage }
            : g
        )
      );
    } else {
      setGroups([
        ...groups,
        {
          id: Date.now().toString(),
          name,
          hasCookingStage,
          hasPackagingStage,
        },
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#f4f6f8] p-6 overflow-hidden select-none relative">
      <div className="max-w-6xl w-full mx-auto bg-white border border-[#e5e7eb] rounded-lg shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Header Section */}
        <div className="flex items-start justify-between p-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-[#e86c2e] rounded shadow-sm flex items-center justify-center shrink-0">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1 max-w-3xl">
              <h2 className="text-[18px] font-semibold text-gray-800">Mutfak Grubu Tanımları</h2>
              <p className="text-[13px] text-gray-500 leading-snug">
                Bu ekranda işletmenizdeki mutfak grupları (ör. mutfak, bar, fırın, nargile) tanımlanır. Daha sonra 
                <span className="text-[#3b82f6] cursor-pointer hover:underline mx-1">Menü/Ürünler</span>
                ekranında ilgili ürün seçilerek, tanımlanan mutfak grubu atanır. (örneğin, 'İçecek' adında bir mutfak grubu tanımlanıp 
                kola ürününün mutfak grubu 'İçecek' olarak güncellenirse, kola siparişi içecek bölümündeki ekrana veya yazıcıya gönderilir.)
              </p>
            </div>
          </div>
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-4 py-2 rounded-md font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Yeni
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="px-6 pb-4">
          <div className="bg-[#fafafa] border border-gray-200 rounded-md p-4 flex flex-col gap-2">
            <p className="text-[13px] text-[#d32f2f]">
              Tüm mutfak gruplarında varsayılan <span className="font-semibold">Mutfak Durumu 'Hazırlanıyor ve Hazırlandı'</span> olarak atanmıştır.
            </p>
            <p className="text-[13px] text-[#d32f2f]">
              Eğer mutfakta pişirme ve hazırlama aşamaları varsa düzenle bölümünden bu kısımları da dahil edebilirsiniz
            </p>
          </div>
        </div>

        {/* Table View */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 uppercase">Grup Adı</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 uppercase">Mutfak Durumu</th>
                <th className="py-3 px-2 text-[13px] font-semibold text-gray-700 uppercase text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <tr key={group.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-2 text-[14px] text-gray-800">{group.name}</td>
                  <td className="py-3 px-2 text-[13px] text-gray-600">
                    {[
                      group.hasCookingStage ? "Pişirme" : "",
                      group.hasPackagingStage ? "Paketleme" : "",
                    ].filter(Boolean).join(", ")}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-3 text-[13px]">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(group)}
                        className="text-[#d32f2f] hover:underline font-medium cursor-pointer"
                      >
                        Düzenle
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(group.id)}
                        className="text-[#d32f2f] hover:underline font-medium cursor-pointer"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-gray-500 text-[14px]">
                    Hiç mutfak grubu kaydı bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-[500px] max-w-[95vw] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900">Mutfak Grubu Tanımla</h3>
                <p className="text-[13px] text-gray-500 mt-0.5">Yeni mutfak grubu bilgilerini giriniz.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[#d32f2f] hover:bg-red-50 p-1.5 rounded-md transition-colors -mt-2 -mr-2 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 flex flex-col gap-6">
              
              <div className="flex flex-col relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-gray-300 py-1.5 text-[14px] text-gray-900 focus:outline-none focus:border-[#d32f2f] transition-colors peer bg-transparent"
                  placeholder=" "
                />
                <label className={`absolute left-0 text-[12px] transition-all duration-200 pointer-events-none ${
                  name ? 'text-[#d32f2f] -top-3.5' : 'text-[#d32f2f] -top-3.5 peer-focus:-top-3.5 peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-[14px]'
                }`}>
                  Grup Adı*
                </label>
              </div>

              <div className="flex items-center gap-8 mt-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      checked={hasCookingStage}
                      onChange={(e) => setHasCookingStage(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border border-gray-400 rounded-sm peer-checked:bg-white peer-checked:border-gray-800 transition-all"></div>
                    <svg
                      className="absolute w-3 h-3 text-gray-800 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-gray-700">Pişirme aşaması</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="checkbox"
                      checked={hasPackagingStage}
                      onChange={(e) => setHasPackagingStage(e.target.checked)}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border border-gray-400 rounded-sm peer-checked:bg-white peer-checked:border-gray-800 transition-all"></div>
                    <svg
                      className="absolute w-3 h-3 text-gray-800 pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[14px] text-gray-700">Paketleme aşaması</span>
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2 rounded font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
              >
                {editingGroup ? "Kaydet" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
