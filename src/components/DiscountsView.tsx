"use client";

import React, { useState } from "react";
import { TrendingDown, Download, Plus, ArrowUpDown, X, Edit, Trash2 } from "lucide-react";

interface Discount {
  id: string;
  name: string;
  type: string;
  amount: number;
}

const initialDiscounts: Discount[] = [];

export default function DiscountsView() {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Yüzde (%)");
  const [amount, setAmount] = useState<number | string>(0);

  const handleOpenNew = () => {
    setEditingDiscount(null);
    setName("");
    setType("Yüzde (%)");
    setAmount(0);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setName(discount.name);
    setType(discount.type);
    setAmount(discount.amount);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setDiscounts(discounts.filter((d) => d.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    if (editingDiscount) {
      setDiscounts(
        discounts.map((d) =>
          d.id === editingDiscount.id
            ? { ...d, name, type, amount: Number(amount) || 0 }
            : d
        )
      );
    } else {
      setDiscounts([
        ...discounts,
        {
          id: Date.now().toString(),
          name,
          type,
          amount: Number(amount) || 0,
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
              <TrendingDown className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col gap-1 max-w-2xl">
              <h2 className="text-[18px] font-semibold text-gray-800">İndirimler</h2>
              <p className="text-[13px] text-gray-500 leading-snug">
                Tanımlı indirimleri buradan görebilir ve yeni indirim tanımlayabilirsiniz.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex items-center gap-1 text-[#d32f2f] hover:bg-red-50 px-3 py-2 rounded-md font-medium text-[14px] transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              İndir
            </button>
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

        {/* Table View */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 px-2 text-[13px] font-medium text-gray-700">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                    İndirim Adı
                    <ArrowUpDown className="w-3 h-3 text-red-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-[13px] font-medium text-gray-700">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                    İndirim Türü
                    <ArrowUpDown className="w-3 h-3 text-red-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-[13px] font-medium text-gray-700">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900 transition-colors">
                    İndirim Tutarı
                    <ArrowUpDown className="w-3 h-3 text-red-400" />
                  </div>
                </th>
                <th className="py-3 px-2 text-[13px] font-medium text-gray-700">Düzenle / Sil</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((discount) => (
                <tr key={discount.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-2 text-[14px] text-gray-800">{discount.name}</td>
                  <td className="py-4 px-2 text-[14px] text-gray-800">{discount.type}</td>
                  <td className="py-4 px-2 text-[14px] text-gray-800">{discount.amount}</td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-4 text-gray-500">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(discount)}
                        className="hover:text-gray-800 cursor-pointer p-1"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(discount.id)}
                        className="hover:text-[#d32f2f] cursor-pointer p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {discounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500 text-[14px]">
                    Hiç indirim kaydı bulunamadı.
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
          <div className="relative bg-white rounded-lg shadow-xl w-[480px] max-w-[95vw] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-start justify-between px-6 pt-6 pb-2">
              <div>
                <h3 className="text-[18px] font-medium text-gray-900">İndirim Tanımla</h3>
                <p className="text-[13px] text-gray-500 mt-0.5">Yeni indirim bilgilerini giriniz</p>
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
              
              <div className="flex flex-col">
                <label className="text-[12px] text-gray-500 mb-1">İndirim Adı*</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-b border-gray-300 py-1 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex flex-col relative">
                <label className="text-[12px] text-gray-500 mb-1">İndirim Tipi*</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full border-b border-gray-300 py-1 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-transparent"
                >
                  <option value="Yüzde (%)">Yüzde (%)</option>
                  <option value="Tutar (₺)">Tutar (₺)</option>
                </select>
                <div className="pointer-events-none absolute bottom-2 right-0 flex items-center text-gray-500">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[12px] text-gray-500 mb-1">İndirim Tutarı*</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border-b border-gray-300 py-1 text-[14px] text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 flex justify-end">
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2 rounded font-medium text-[14px] shadow-sm transition-colors cursor-pointer"
              >
                {editingDiscount ? "Kaydet" : "Ekle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
