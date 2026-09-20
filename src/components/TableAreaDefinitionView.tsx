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
  Plus,
  LayoutGrid,
  ListOrdered,
  Check,
  Edit2,
  Table as TableIcon,
} from "lucide-react";
import { TableData } from "@/data/posData";

interface TableAreaDefinitionViewProps {
  tables: TableData[];
  onOpenDrawer: () => void;
  onSelectTable?: (table: TableData) => void;
}

export default function TableAreaDefinitionView({
  tables,
  onOpenDrawer,
  onSelectTable,
}: TableAreaDefinitionViewProps) {
  const [activeTab, setActiveTab] = useState<"salon" | "bolge2">("salon");
  const [localTables, setLocalTables] = useState<TableData[]>(tables);

  const currentTables = localTables.filter((t) => t.section === activeTab);

  const handleAddNewTable = () => {
    const nextNum = currentTables.length + 1;
    const newName = activeTab === "salon" ? `Masa ${nextNum}` : `Bahçe ${nextNum}`;
    const newTable: TableData = {
      id: `t-custom-${Date.now()}`,
      name: newName,
      section: activeTab,
      status: "empty",
      items: [],
    };
    setLocalTables([...localTables, newTable]);
  };

  const handleEditTableName = (tableId: string) => {
    const target = localTables.find((t) => t.id === tableId);
    if (!target) return;
    const newName = prompt("Masa Adını Düzenle:", target.name);
    if (newName && newName.trim()) {
      setLocalTables(
        localTables.map((t) =>
          t.id === tableId ? { ...t, name: newName.trim() } : t
        )
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] overflow-hidden select-none">
      {/* Main Content Card Container */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-xl shadow-xs border border-[#e2e8f0] p-6 mb-6">
          {/* Header row with orange icon, titles, and red action buttons */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#d96726] flex items-center justify-center text-white shadow-xs shrink-0">
                <TableIcon className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#1f2937]">Masa / Bölgeler</h1>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Restoranınıza ait masa ve bölgeleri bu ekrandan düzenleyebilirsiniz.
                </p>
              </div>
            </div>

            {/* Action buttons matching screenshot media_1789840546714.png */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#b84a43]">
              <button
                type="button"
                onClick={() => alert("Yeni Bölge Ekle")}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Bölge Ekle</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Bölgeleri Düzenle")}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Bölgeleri Düzenle</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Bölgeleri Sırala")}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <ListOrdered className="w-4 h-4" />
                <span>Bölgeleri Sırala</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Bölge Düzeni Sıfırlandı")}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Bölge Düzenini Sıfırla</span>
              </button>

              <button
                type="button"
                onClick={() => alert("Toplu Masa Ekleme")}
                className="flex items-center gap-1 hover:underline cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Toplu Masa Ekleme</span>
              </button>

              <button
                type="button"
                onClick={handleAddNewTable}
                className="flex items-center gap-1 hover:underline cursor-pointer font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Masa</span>
              </button>
            </div>
          </div>

          {/* Region Tabs (Salon, bölge 2) */}
          <div className="flex items-center gap-6 mt-4 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("salon")}
              className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
                activeTab === "salon"
                  ? "text-[#111827] border-b-2 border-[#b84a43]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              Salon
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bolge2")}
              className={`pb-3 text-sm font-semibold transition-all cursor-pointer relative ${
                activeTab === "bolge2"
                  ? "text-[#111827] border-b-2 border-[#b84a43]"
                  : "text-[#6b7280] hover:text-[#111827]"
              }`}
            >
              bölge 2
            </button>
          </div>
        </div>

        {/* Tables Grid with Edit Pencil */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {currentTables.map((table) => (
            <div
              key={table.id}
              className="h-28 rounded-lg bg-[#f1f3f6] border border-[#d8dde4] p-3 flex flex-col justify-between relative hover:border-[#b84a43] transition-colors group cursor-pointer"
              onClick={() => onSelectTable && onSelectTable(table)}
            >
              {/* Top right red pencil edit button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTableName(table.id);
                }}
                className="absolute top-2.5 right-2.5 p-1 rounded hover:bg-white/80 text-[#b84a43] cursor-pointer"
                title="Masa Düzenle"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex-1 flex items-center justify-center">
                <span className="font-semibold text-sm text-[#1f2937]">
                  {table.name}
                </span>
              </div>

              {/* Folded corner bottom right decoration */}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-gray-300 clip-corner rounded-br" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
