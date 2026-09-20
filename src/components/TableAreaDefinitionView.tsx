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
  X,
  GripVertical,
  AlertTriangle
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

  // Modals state
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [isRegionSortModalOpen, setIsRegionSortModalOpen] = useState(false);
  const [isResetLayoutModalOpen, setIsResetLayoutModalOpen] = useState(false);
  const [isBulkTableModalOpen, setIsBulkTableModalOpen] = useState(false);
  
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<TableData | null>(null);
  
  const [tableModalForm, setTableModalForm] = useState({ name: "", shape: "kare" });
  const [bulkTableForm, setBulkTableForm] = useState({ name: "Masa", count: 1, shape: "kare" });

  const currentTables = localTables.filter((t) => t.section === activeTab);

  const openNewTableModal = () => {
    setEditingTable(null);
    setTableModalForm({ name: "", shape: "kare" });
    setIsTableModalOpen(true);
  };

  const openEditTableModal = (table: TableData, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTable(table);
    setTableModalForm({ name: table.name, shape: "kare" }); // assuming all are kare by default for now
    setIsTableModalOpen(true);
  };

  const handleSaveTable = () => {
    if (editingTable) {
      setLocalTables(
        localTables.map((t) =>
          t.id === editingTable.id ? { ...t, name: tableModalForm.name } : t
        )
      );
    } else {
      const newTable: TableData = {
        id: `t-custom-${Date.now()}`,
        name: tableModalForm.name || "Yeni Masa",
        section: activeTab,
        status: "empty",
        items: [],
      };
      setLocalTables([...localTables, newTable]);
    }
    setIsTableModalOpen(false);
  };

  const handleDeleteTable = () => {
    if (editingTable) {
      setLocalTables(localTables.filter((t) => t.id !== editingTable.id));
    }
    setIsTableModalOpen(false);
  };

  const handleBulkAddTables = () => {
    const count = Math.max(1, bulkTableForm.count);
    const newTables: TableData[] = Array.from({ length: count }).map((_, i) => {
      // Find highest existing number for this prefix
      const existingWithPrefix = localTables.filter(t => t.name.startsWith(bulkTableForm.name));
      const highestNum = existingWithPrefix.reduce((max, t) => {
        const numMatch = t.name.replace(bulkTableForm.name, "").trim().match(/(\d+)$/);
        const num = numMatch ? parseInt(numMatch[1]) : 0;
        return Math.max(max, num);
      }, 0);
      
      const newName = count === 1 
        ? bulkTableForm.name 
        : `${bulkTableForm.name} ${highestNum + i + 1}`;
        
      return {
        id: `t-bulk-${Date.now()}-${i}`,
        name: newName,
        section: activeTab,
        status: "empty",
        items: [],
      };
    });
    
    setLocalTables([...localTables, ...newTables]);
    setIsBulkTableModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#edf0f5] p-6 overflow-hidden select-none">
      {/* Main Container */}
      <div className="flex-1 bg-white border border-[#d8dde4] rounded shadow-sm flex flex-col h-full overflow-hidden">
        
        {/* Header Section */}
        <div className="p-6 pb-2">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-[#e87030] flex items-center justify-center text-white shadow-sm shrink-0">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-gray-800">Masa / Bölgeler</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Restoranınıza ait masa ve bölgeleri bu ekrandan düzenleyebilirsiniz.
                </p>
              </div>
            </div>

            {/* Action buttons matching screenshot */}
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-[#c63131]">
              <button
                type="button"
                onClick={() => setIsRegionModalOpen(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Bölge Ekle</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRegionModalOpen(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Bölgeleri Düzenle</span>
              </button>

              <button
                type="button"
                onClick={() => setIsRegionSortModalOpen(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <ListOrdered className="w-4 h-4" />
                <span>Bölgeleri Sırala</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResetLayoutModalOpen(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Bölge Düzenini Sıfırla</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBulkTableModalOpen(true)}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <LayoutGrid className="w-4 h-4" />
                <span>Toplu Masa Ekleme</span>
              </button>

              <button
                type="button"
                onClick={openNewTableModal}
                className="flex items-center gap-1.5 hover:underline cursor-pointer transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Masa</span>
              </button>
            </div>
          </div>

          {/* Region Tabs (Salon, bölge 2) */}
          <div className="flex items-center gap-2 mt-8 border-b border-gray-200">
            <button
              type="button"
              onClick={() => setActiveTab("salon")}
              className={`px-6 py-2 text-sm font-medium transition-all cursor-pointer relative ${
                activeTab === "salon"
                  ? "text-gray-800 bg-[#eef0f4] border-b-2 border-[#c63131] rounded-t"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              Salon
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bolge2")}
              className={`px-6 py-2 text-sm font-medium transition-all cursor-pointer relative ${
                activeTab === "bolge2"
                  ? "text-gray-800 bg-[#eef0f4] border-b-2 border-[#c63131] rounded-t"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              bölge 2
            </button>
          </div>
        </div>

        {/* Tables Grid Content Area */}
        <div className="flex-1 bg-[#eef0f4] p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {currentTables.map((table) => (
              <div
                key={table.id}
                className="h-28 bg-white border border-gray-300 rounded shadow-sm p-3 flex flex-col justify-center items-center relative hover:border-[#c63131] transition-colors group cursor-pointer"
                onClick={() => onSelectTable && onSelectTable(table)}
              >
                {/* Top right red pencil edit button */}
                <button
                  type="button"
                  onClick={(e) => openEditTableModal(table, e)}
                  className="absolute top-2 right-2 p-1 text-[#c63131] cursor-pointer hover:bg-gray-100 rounded"
                  title="Masa Düzenle"
                >
                  <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                </button>

                <span className="font-medium text-sm text-gray-800">
                  {table.name}
                </span>

                {/* Folded corner bottom right decoration */}
                <div 
                  className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-gray-400 opacity-60"
                  style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bölge Tanımlama Modal */}
      {isRegionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Bölge Tanımlama</h2>
              <p className="text-sm text-gray-500 font-medium">Yeni bir bölge tanımlayın</p>
              
              <div className="flex justify-end my-4">
                <button className="flex items-center gap-1 px-4 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white font-medium text-sm rounded shadow-sm transition-colors">
                  <Plus className="w-4 h-4" />
                  Yeni
                </button>
              </div>

              <div className="flex flex-col mt-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-800">Salon</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-800">bölge 2</span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end w-full mt-10">
                <button
                  type="button"
                  onClick={() => setIsRegionModalOpen(false)}
                  className="px-6 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bölgeleri Sırala Modal */}
      {isRegionSortModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative">
            <div className="p-6 pb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-1">Bölgeleri Sırala</h2>
              <p className="text-sm text-gray-500 font-medium">Yerini değiştirmek istediğiniz bölgeyi sürükleyebilirsiniz</p>

              <div className="flex flex-col mt-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 cursor-move">
                  <span className="text-sm font-medium text-gray-800">Salon</span>
                  <button className="text-gray-600 hover:text-gray-900 cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 cursor-move">
                  <span className="text-sm font-medium text-gray-800">bölge 2</span>
                  <button className="text-gray-600 hover:text-gray-900 cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end w-full mt-10 gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegionSortModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => setIsRegionSortModalOpen(false)}
                  className="px-6 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white font-bold text-sm rounded shadow-sm cursor-pointer transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bölge Düzenini Sıfırla Confirmation Alert */}
      {isResetLayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-2xl w-full max-w-[450px] overflow-hidden flex flex-col relative">
            <button
              type="button"
              onClick={() => setIsResetLayoutModalOpen(false)}
              className="absolute top-4 right-4 text-[#df3232] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8 pb-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-4 text-[#df3232] flex items-center justify-center relative">
                 <AlertTriangle className="w-12 h-12" />
                 {/* Decorative dots to match the UI screenshot */}
                 <div className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-[#df3232]"></div>
                 <div className="absolute top-2 left-0 w-1.5 h-1.5 rounded-full bg-[#df3232]"></div>
                 <div className="absolute top-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-[#df3232]"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Masa Düzeni Sıfırlama</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                Seçili bölgeye ait masaların boyutlarını ve konumlarını varsayılan ayara döndürmek istediğinize emin misiniz?
              </p>
              
              <div className="flex items-center justify-center w-full mt-8 gap-3 px-2">
                <button
                  type="button"
                  onClick={() => setIsResetLayoutModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#df3232] font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetLayoutModalOpen(false)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#df3232] hover:bg-[#c22b2b] text-white font-bold text-sm rounded shadow-sm cursor-pointer transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Devam Et
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toplu Masa Ekleme Modal */}
      {isBulkTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative">
            <button
              type="button"
              onClick={() => setIsBulkTableModalOpen(false)}
              className="absolute top-4 right-4 text-[#df3232] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-8">Masa Tanımlama</h2>
              
              <div className="relative mb-8">
                <label className="text-xs font-bold text-[#df3232] absolute -top-5 left-0">
                  Masa Adı*
                </label>
                <div className="flex items-center border-b-2 border-[#df3232]">
                  <input 
                    type="text" 
                    value={bulkTableForm.name}
                    onChange={(e) => setBulkTableForm({...bulkTableForm, name: e.target.value})}
                    className="w-full py-2 bg-transparent outline-none text-gray-800 font-medium"
                  />
                  {bulkTableForm.name && (
                    <button 
                      onClick={() => setBulkTableForm({...bulkTableForm, name: ""})}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="relative mb-6">
                <label className="text-xs font-bold text-[#df3232] absolute -top-5 left-0">
                  Miktar*
                </label>
                <div className="flex items-center border-b-2 border-[#df3232]">
                  <input 
                    type="number" 
                    min="1"
                    value={bulkTableForm.count}
                    onChange={(e) => setBulkTableForm({...bulkTableForm, count: parseInt(e.target.value) || 1})}
                    className="w-full py-2 bg-transparent outline-none text-gray-800 font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center gap-12 mb-16 px-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bulkTableForm.shape === 'kare' ? 'border-[#df3232]' : 'border-gray-400'}`}>
                    {bulkTableForm.shape === 'kare' && <div className="w-2.5 h-2.5 rounded-full bg-[#df3232]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="bulkShape" 
                    value="kare" 
                    checked={bulkTableForm.shape === 'kare'}
                    onChange={() => setBulkTableForm({...bulkTableForm, shape: "kare"})}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-800">Kare</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${bulkTableForm.shape === 'daire' ? 'border-[#df3232]' : 'border-gray-400'}`}>
                    {bulkTableForm.shape === 'daire' && <div className="w-2.5 h-2.5 rounded-full bg-[#df3232]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="bulkShape" 
                    value="daire" 
                    checked={bulkTableForm.shape === 'daire'}
                    onChange={() => setBulkTableForm({...bulkTableForm, shape: "daire"})}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-800">Daire</span>
                </label>
              </div>

              <div className="flex items-center justify-end w-full gap-2">
                <button
                  type="button"
                  onClick={() => setIsBulkTableModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleBulkAddTables}
                  className="px-6 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white font-bold text-sm rounded shadow-sm cursor-pointer transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Masa Tanımlama Modal */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded shadow-2xl w-full max-w-[500px] overflow-hidden flex flex-col relative">
            <button
              type="button"
              onClick={() => setIsTableModalOpen(false)}
              className="absolute top-4 right-4 text-[#df3232] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-8">Masa Tanımlama</h2>
              
              <div className="relative mb-6">
                <label className="text-xs font-bold text-[#df3232] absolute -top-5 left-0">
                  Masa Adı*
                </label>
                <div className="flex items-center border-b-2 border-[#df3232]">
                  <input 
                    type="text" 
                    value={tableModalForm.name}
                    onChange={(e) => setTableModalForm({...tableModalForm, name: e.target.value})}
                    className="w-full py-2 bg-transparent outline-none text-gray-800 font-medium"
                  />
                  {tableModalForm.name && (
                    <button 
                      onClick={() => setTableModalForm({...tableModalForm, name: ""})}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-12 mb-16 px-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tableModalForm.shape === 'kare' ? 'border-[#df3232]' : 'border-gray-400'}`}>
                    {tableModalForm.shape === 'kare' && <div className="w-2.5 h-2.5 rounded-full bg-[#df3232]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="shape" 
                    value="kare" 
                    checked={tableModalForm.shape === 'kare'}
                    onChange={() => setTableModalForm({...tableModalForm, shape: "kare"})}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-800">Kare</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${tableModalForm.shape === 'daire' ? 'border-[#df3232]' : 'border-gray-400'}`}>
                    {tableModalForm.shape === 'daire' && <div className="w-2.5 h-2.5 rounded-full bg-[#df3232]" />}
                  </div>
                  <input 
                    type="radio" 
                    name="shape" 
                    value="daire" 
                    checked={tableModalForm.shape === 'daire'}
                    onChange={() => setTableModalForm({...tableModalForm, shape: "daire"})}
                    className="hidden"
                  />
                  <span className="text-sm font-medium text-gray-800">Daire</span>
                </label>
              </div>

              <div className="flex items-center justify-end w-full gap-2">
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(false)}
                  className="px-4 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                >
                  İptal
                </button>
                {editingTable && (
                  <button
                    type="button"
                    onClick={handleDeleteTable}
                    className="px-4 py-2 bg-transparent text-[#df3232] hover:bg-gray-50 font-bold text-sm rounded cursor-pointer transition-colors"
                  >
                    Sil
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSaveTable}
                  className="px-6 py-2 bg-[#df3232] hover:bg-[#c22b2b] text-white font-bold text-sm rounded shadow-sm cursor-pointer transition-colors"
                >
                  {editingTable ? "Güncelle" : "Kaydet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
