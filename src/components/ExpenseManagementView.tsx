"use client";

import React, { useState } from "react";
import {
  Menu,
  Gift,
  Users,
  RefreshCw,
  MoreVertical,
  Megaphone,
  Headphones,
  UserCog,
  TrendingDown,
  Download,
  ListFilter,
  Plus,
  Calendar,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface ExpenseManagementViewProps {
  onOpenDrawer: () => void;
}

export default function ExpenseManagementView({
  onOpenDrawer,
}: ExpenseManagementViewProps) {
  const [startDate] = useState("19.09.2026 06:00");
  const [endDate] = useState("19.09.2026 23:45");
  const [expenses, setExpenses] = useState<any[]>([]);

  const handleAddExpense = () => {
    const title = prompt("Masraf Tipi (örn: Mutfak Tedarik, Kira, Fatura):", "");
    if (!title) return;
    const amountStr = prompt("Tutar (₺):", "150");
    const amount = parseFloat(amountStr || "0") || 0;

    const newExpense = {
      id: `exp-${Date.now()}`,
      type: title,
      expenseDate: "19.09.2026 21:00",
      createdDate: "19.09.2026 21:00",
      user: "Ahmet",
      paymentType: "Nakit",
      amount,
      detail: "Hızlı masraf kaydı",
    };
    setExpenses([newExpense, ...expenses]);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-14 bg-white border-b border-[#d8dde4] px-4 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="p-1.5 hover:bg-gray-100 rounded-[4px] text-[#2b2f36] cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm text-[#2b2f36]">
            İşlemler / Gider ve Masraflar
          </span>
        </div>

        {/* Right standard POS controls */}
        <div className="flex items-center gap-3 text-xs text-[#4b5563]">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#fde68a] text-amber-900 flex items-center justify-center hover:opacity-90 cursor-pointer"
          >
            <Gift className="w-4 h-4" />
          </button>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5e7eb] hover:bg-gray-200 text-xs font-semibold text-[#374151] cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Katıl</span>
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <MoreVertical className="w-4 h-4 text-[#4b5563]" />
          </button>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-[#e5e7eb] hover:bg-gray-200 flex items-center justify-center cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-[#4b5563]" />
          </button>

          <div className="h-5 w-px bg-gray-300 mx-1" />

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fee2e2] text-[#b84a43] text-xs font-semibold hover:bg-[#fecaca] cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Destek İste</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#dbeafe] text-[#1e40af] text-xs font-semibold">
            <UserCog className="w-3.5 h-3.5" />
            <span>84425 - Ahmet</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-6 mb-6">
          {/* Title Header matching islemler_menu_1789841348848.png */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#831843] flex items-center justify-center text-white shadow-xs shrink-0">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1f2937]">Gider ve Masraflar</h1>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Gider ve masraflarınızı bu sayfadan yönetebilirsiniz.
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("İndiriliyor...")}
                className="flex items-center gap-1 text-xs font-semibold text-[#b84a43] hover:underline cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>İndir</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Masraf Tipleri Düzenleme")}
                className="flex items-center gap-1.5 px-3 py-2 rounded border border-gray-300 text-xs font-semibold text-[#b84a43] hover:bg-gray-50 cursor-pointer"
              >
                <ListFilter className="w-4 h-4" />
                <span>Masraf Tiplerini Düzenle</span>
              </button>

              <button
                type="button"
                onClick={handleAddExpense}
                className="flex items-center gap-1 px-4 py-2 rounded bg-[#b84a43] text-white text-xs font-semibold hover:bg-[#a53f38] cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Masraf Ekle</span>
              </button>
            </div>
          </div>

          {/* Filters Bar matching screenshot */}
          <div className="flex flex-wrap items-center gap-3 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d8dde4] rounded text-xs text-gray-700">
              <span>{startDate}</span>
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#d8dde4] rounded text-xs text-gray-700">
              <span>{endDate}</span>
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between gap-4 px-3 py-1.5 bg-white border border-[#d8dde4] rounded text-xs text-gray-700 cursor-pointer">
              <span>Tümü</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="flex items-center justify-between gap-4 px-3 py-1.5 bg-white border border-[#d8dde4] rounded text-xs text-gray-700 cursor-pointer">
              <span>Tümü</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>

            <button
              type="button"
              className="px-4 py-1.5 text-xs text-gray-500 hover:text-gray-800 font-medium cursor-pointer"
            >
              Filtreyi Temizle
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600 font-semibold">
                  <th className="py-3 px-2">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Masraf Tipi</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-2">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Masraf Tarihi</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-2">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Eklenme Tarihi</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-2">Kullanıcı</th>
                  <th className="py-3 px-2">Ödeme Tipi</th>
                  <th className="py-3 px-2">
                    <div className="flex items-center gap-1 cursor-pointer">
                      <span>Tutar</span>
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    </div>
                  </th>
                  <th className="py-3 px-2">Masraf Detayı</th>
                  <th className="py-3 px-2 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-12 text-center text-gray-500 font-normal"
                    >
                      Herhangi bir sonuç bulunamadı, farklı filtreler deneyerek aramanızı genişletebilirsiniz.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium text-gray-900">{exp.type}</td>
                      <td className="py-3 px-2 text-gray-500">{exp.expenseDate}</td>
                      <td className="py-3 px-2 text-gray-500">{exp.createdDate}</td>
                      <td className="py-3 px-2 text-gray-800">{exp.user}</td>
                      <td className="py-3 px-2 text-gray-800">{exp.paymentType}</td>
                      <td className="py-3 px-2 font-bold text-[#b84a43]">
                        ₺{exp.amount.toFixed(2).replace(".", ",")}
                      </td>
                      <td className="py-3 px-2 text-gray-600">{exp.detail}</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setExpenses(expenses.filter((e) => e.id !== exp.id))
                          }
                          className="text-red-600 hover:underline cursor-pointer"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination matching screenshot */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 text-xs text-gray-500">
            <button type="button" className="cursor-pointer text-gray-400 hover:text-gray-700">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>{expenses.length > 0 ? "1 / 1" : "1 / 0"}</span>
            <button type="button" className="cursor-pointer text-gray-400 hover:text-gray-700">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
