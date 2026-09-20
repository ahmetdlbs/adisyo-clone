"use client";

import React, { useState } from "react";
import {
  Menu,
  Store,
  Bike,
  LayoutGrid,
  Kanban,
  Wifi,
  PhoneCall,
  RotateCw,
  Lock,
  Megaphone,
  Headphones,
  User,
  MoreVertical,
  Eye,
} from "lucide-react";
import { TableData, KanbanOrder } from "@/data/posData";
import OrdersKanbanView from "./OrdersKanbanView";

interface OrderPosViewProps {
  tables: TableData[];
  kanbanOrders: KanbanOrder[];
  onOpenDrawer: () => void;
  onSelectTable: (table: TableData) => void;
  onOpenTableQuickModal: (table: TableData) => void;
  onSelectKanbanOrder: (order: KanbanOrder) => void;
  onQuickGelAl: () => void;
  onQuickPaket: () => void;
  onLogout: () => void;
}

export default function OrderPosView({
  tables,
  kanbanOrders,
  onOpenDrawer,
  onSelectTable,
  onOpenTableQuickModal,
  onSelectKanbanOrder,
  onQuickGelAl,
  onQuickPaket,
  onLogout,
}: OrderPosViewProps) {
  const [subView, setSubView] = useState<"bolgeler" | "siparisler">("bolgeler");
  const [selectedSection, setSelectedSection] = useState<"salon" | "bolge2">("salon");

  const salonTables = tables.filter((t) => t.section === "salon");
  const bolge2Tables = tables.filter((t) => t.section === "bolge2");

  const salonOccupiedCount = salonTables.filter((t) => t.status === "occupied").length;
  const bolge2OccupiedCount = bolge2Tables.filter((t) => t.status === "occupied").length;

  const currentTables = selectedSection === "salon" ? salonTables : bolge2Tables;

  return (
    <div className="flex-1 flex h-screen w-screen overflow-hidden select-none bg-[#edf0f5]">
      {/* Left Action Toolbar Rail */}
      <div className="w-[72px] bg-white border-r border-[#e2e6eb] flex flex-col items-center py-4 justify-between shrink-0 z-20">
        {/* Top: Menü Button */}
        <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="flex flex-col items-center justify-center text-[#2b2f36] hover:text-[#b84a43] p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
          >
            <Menu className="w-6 h-6 stroke-[2]" />
            <span className="text-[11px] font-medium mt-1">Menü</span>
          </button>
        </div>

        {/* Middle: Gel Al & Paket Cards */}
        <div className="space-y-4 flex flex-col items-center w-full px-2">
          {/* Gel Al */}
          <button
            type="button"
            onClick={onQuickGelAl}
            className="w-full h-16 rounded-[8px] border border-[#d8dde4] bg-white hover:border-[#b84a43] hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-[#2b2f36] transition-all cursor-pointer shadow-2xs relative"
          >
            <div className="relative">
              <Store className="w-5 h-5 text-[#374151]" />
              <span className="absolute -top-1 -right-1 text-[8px] bg-black text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">
                +
              </span>
            </div>
            <span className="text-[11px] font-medium">Gel Al</span>
          </button>

          {/* Paket */}
          <button
            type="button"
            onClick={onQuickPaket}
            className="w-full h-16 rounded-[8px] border border-[#d8dde4] bg-white hover:border-[#b84a43] hover:bg-gray-50 flex flex-col items-center justify-center gap-1 text-[#2b2f36] transition-all cursor-pointer shadow-2xs relative"
          >
            <div className="relative">
              <Bike className="w-5 h-5 text-[#374151]" />
              <span className="absolute -top-1 -right-1 text-[8px] bg-black text-white rounded-full w-3 h-3 flex items-center justify-center font-bold">
                +
              </span>
            </div>
            <span className="text-[11px] font-medium">Paket</span>
          </button>
        </div>

        {/* Bottom spacer */}
        <div className="h-6" />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header of POS (Matching table_layout_screen_pos_1789837221695.png) */}
        <div className="h-14 px-6 flex items-center justify-between shrink-0">
          {/* Left: [ Bölgeler ] / [ Siparişler ] Switcher */}
          <div className="flex items-center bg-[#e4e8ef] p-1 rounded-[6px]">
            <button
              type="button"
              onClick={() => setSubView("bolgeler")}
              className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                subView === "bolgeler"
                  ? "bg-[#374151] text-white shadow-xs"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Bölgeler</span>
            </button>

            <button
              type="button"
              onClick={() => setSubView("siparisler")}
              className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-xs font-semibold transition-all cursor-pointer ${
                subView === "siparisler"
                  ? "bg-[#374151] text-white shadow-xs"
                  : "text-[#4b5563] hover:text-[#111827]"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Siparişler</span>
            </button>
          </div>

          {/* Right: Duyurular, Destek İste, User Profile */}
          <div className="flex items-center gap-6 text-xs text-[#374151] font-medium">
            <button
              type="button"
              onClick={() => alert("Duyurular")}
              className="flex items-center gap-1.5 hover:text-black cursor-pointer"
            >
              <Megaphone className="w-4 h-4 text-[#4b5563]" />
              <span>Duyurular</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Destek İste")}
              className="flex items-center gap-1.5 hover:text-black cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-[#4b5563]" />
              <span>Destek İste</span>
            </button>

            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#4b5563]" />
              <span>84425-Ahmet</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Icons Bar on the Right — only on Bölgeler */}
        {subView === "bolgeler" && (
        <div className="px-6 flex justify-end gap-2 pb-2 shrink-0">
          <button
            type="button"
            className="w-10 h-10 rounded-[6px] bg-white border border-[#d8dde4] text-[#4b5563] hover:bg-gray-50 flex items-center justify-center cursor-pointer shadow-2xs"
            title="Ağ Durumu"
          >
            <Wifi className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="w-10 h-10 rounded-[6px] bg-white border border-[#d8dde4] text-[#4b5563] hover:bg-gray-50 flex items-center justify-center cursor-pointer shadow-2xs"
            title="Çağrı Merkezi"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-10 h-10 rounded-[6px] bg-white border border-[#d8dde4] text-[#4b5563] hover:bg-gray-50 flex items-center justify-center cursor-pointer shadow-2xs"
            title="Yenile"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="w-10 h-10 rounded-[6px] bg-white border border-[#d8dde4] text-[#4b5563] hover:bg-gray-50 flex items-center justify-center cursor-pointer shadow-2xs"
            title="Kilitle"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
        )}


        {/* Content View */}
        {subView === "bolgeler" ? (
          <div className="flex-1 flex flex-col overflow-hidden px-6">
            {/* Sub-header: Zone Tabs on Left, Siparişler button on Right */}
            <div className="border-b border-[#d8dde4] pb-2 flex items-center justify-between shrink-0 mb-4">
              <div className="flex items-center gap-6">
                {/* Salon Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedSection("salon")}
                  className={`flex items-center gap-2 pb-2 text-sm font-semibold cursor-pointer relative transition-all ${
                    selectedSection === "salon"
                      ? "text-black border-b-2 border-black"
                      : "text-[#6b7280] hover:text-black"
                  }`}
                >
                  <span>Salon</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[#1f2937] text-white font-mono">
                    {salonOccupiedCount}/{salonTables.length}
                  </span>
                </button>

                {/* Bölge 2 Tab */}
                <button
                  type="button"
                  onClick={() => setSelectedSection("bolge2")}
                  className={`flex items-center gap-2 pb-2 text-sm font-semibold cursor-pointer relative transition-all ${
                    selectedSection === "bolge2"
                      ? "text-black border-b-2 border-black"
                      : "text-[#6b7280] hover:text-black"
                  }`}
                >
                  <span>bölge 2</span>
                  <span className="px-2 py-0.5 rounded-full text-xs bg-[#d1d5db] text-[#374151] font-mono">
                    {bolge2OccupiedCount}/{bolge2Tables.length}
                  </span>
                </button>
              </div>

              {/* Siparişler Filter Button */}
              <button
                type="button"
                onClick={() => setSubView("siparisler")}
                className="flex items-center gap-2 px-4 py-1.5 bg-white border border-[#d8dde4] rounded-[6px] text-xs font-semibold text-[#374151] hover:bg-gray-50 cursor-pointer shadow-2xs"
              >
                <Eye className="w-4 h-4 text-[#4b5563]" />
                <span>Siparişler</span>
              </button>
            </div>

            {/* Tables Grid */}
            <div className="flex-1 overflow-y-auto pb-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {currentTables.map((table) => {
                  const isOccupied = table.status === "occupied" && table.items.length > 0;
                  const total = table.items.reduce(
                    (acc, it) => acc + (it.isComplimentary ? 0 : it.price * it.quantity),
                    0
                  );

                  if (isOccupied) {
                    return (
                      <div
                        key={table.id}
                        onClick={() => onSelectTable(table)}
                        className="h-32 rounded-[8px] border border-[#e3b8b4] bg-[#ebd0cc] p-3 flex flex-col justify-between cursor-pointer shadow-2xs hover:shadow-sm transition-all"
                      >
                        {/* Top: Table name, customer and 3-dots */}
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-bold text-sm text-[#2b2f36] block">
                              {table.name}
                            </span>
                            <span className="text-xs text-[#5c5f66] font-medium block">
                              {table.customerName || "Ahmet Can"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenTableQuickModal(table);
                            }}
                            className="w-7 h-7 rounded-[4px] bg-[#deb5b2] hover:bg-[#d4a5a1] flex items-center justify-center text-[#2b2f36] cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Center: Total amount */}
                        <div className="text-center">
                          <span className="text-[18px] font-bold text-[#111827]">
                            ₺{total.toFixed(2).replace(".", ",")}
                          </span>
                        </div>

                        {/* Bottom: Elapsed duration */}
                        <div>
                          <span className="text-xs text-[#2b2f36] font-medium">
                            {table.duration || "4 s 20 dk"}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  // Empty table (Clean white card with only centered table name)
                  return (
                    <div
                      key={table.id}
                      onClick={() => onSelectTable(table)}
                      className="h-32 rounded-[8px] border border-[#d8dde4] bg-white p-3 flex items-center justify-center cursor-pointer shadow-2xs hover:border-[#b84a43] transition-all"
                    >
                      <span className="font-semibold text-sm text-[#1f2937]">
                        {table.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <OrdersKanbanView
            orders={kanbanOrders}
            onSelectOrder={onSelectKanbanOrder}
          />
        )}
      </div>
    </div>
  );
}
