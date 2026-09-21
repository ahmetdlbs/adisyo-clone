"use client";

import React, { useState } from "react";
import { Filter, Download, Printer, ChevronRight, Info, X } from "lucide-react";

type TabKey = "bolge" | "kategori" | "urun" | "recete" | "menu" | "ozellik";

interface Tab {
  id: TabKey;
  label: string;
}

const TABS: Tab[] = [
  { id: "bolge", label: "Bölge Bazında" },
  { id: "kategori", label: "Kategori Bazında" },
  { id: "urun", label: "Ürün Bazında" },
  { id: "recete", label: "Reçeteli Ürün Bazında" },
  { id: "menu", label: "Menü Bazında" },
  { id: "ozellik", label: "Özellik Bazında" },
];

export default function ReportSalesProductsView() {
  const [activeTab, setActiveTab] = useState<TabKey>("bolge");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Format date to string like "20.09.2026 - 20.09.2026"
  const today = new Date();
  const dateStr = `${today.getDate().toString().padStart(2, "0")}.${(today.getMonth() + 1).toString().padStart(2, "0")}.${today.getFullYear()}`;
  const dateRange = `(${dateStr} - ${dateStr})`;

  const renderTableContent = () => {
    switch (activeTab) {
      case "bolge":
        return (
          <>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Bölge</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Müşteri Sayısı</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>İndirim(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Tutar(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Oran(%)</th>
              </tr>
            </thead>
            <tbody>
              {/* Mock Data Row */}
              <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563" }}>Ana Salon</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563", textAlign: "right" }}>42</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563", textAlign: "right" }}>4.500 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", color: "#4b5563", textAlign: "right" }}>100%</td>
              </tr>
              {/* Total Row */}
              <tr>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>TOPLAM</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>42</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>4.500 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>100%</td>
              </tr>
            </tbody>
          </>
        );
      case "kategori":
        return (
          <>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Kategori</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Miktar</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>İndirim(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Maliyet(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Tutar(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Oran(%)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>TOPLAM</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>100%</td>
              </tr>
            </tbody>
          </>
        );
      case "urun":
        return (
          <>
            <thead>
              <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                <th style={{ textAlign: "left", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Ürün Adı</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Miktar</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Birim Fiyatı(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Maliyet(₺)</th>
                <th style={{ textAlign: "right", padding: "16px 24px", fontSize: "14px", fontWeight: 500, color: "#111827" }}>Toplam Tutar(₺)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827" }}>TOPLAM</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
                <td style={{ padding: "16px 24px", fontSize: "14px", fontWeight: 700, color: "#111827", textAlign: "right" }}>0 ₺</td>
              </tr>
            </tbody>
          </>
        );
      default:
        return (
          <tbody>
            <tr>
              <td style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                Bu rapor için veri bulunamadı.
              </td>
            </tr>
          </tbody>
        );
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 64px)", backgroundColor: "#f3f4f6" }}>
      
      {/* Left Sidebar Menu */}
      <div style={{ width: "260px", backgroundColor: "#f3f4f6", borderRight: "1px solid #e5e7eb", flexShrink: 0 }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 24px",
              backgroundColor: activeTab === tab.id ? "#e5e7eb" : "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "14px",
              fontWeight: 500,
              color: "#111827",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "#e5e7eb"; }}
            onMouseLeave={(e) => { if (activeTab !== tab.id) e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            {tab.label}
            {activeTab === tab.id && <ChevronRight size={16} color="#4b5563" />}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, backgroundColor: "white" }}>
        
        {/* Header */}
        <div style={{ padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h1 style={{ margin: 0, fontSize: "16px", fontWeight: 500, color: "#111827" }}>
              {TABS.find(t => t.id === activeTab)?.label} <span style={{ color: "#6b7280" }}>{dateRange}</span>
            </h1>
            <Info size={16} color="#eab308" style={{ cursor: "pointer" }} />
          </div>

          <div style={{ display: "flex", gap: "16px" }}>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#dc2626", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              <Filter size={16} />
              Filtrele
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#dc2626", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              <Download size={16} />
              İndir
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", color: "#dc2626", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>
              <Printer size={16} />
              Yazdır
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            {renderTableContent()}
          </table>
        </div>

      </div>

      {/* Filter Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="relative w-[380px] bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-[16px] font-medium text-gray-800">Filtreler</h2>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto px-6 py-4 flex flex-col gap-6">
              
              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Tarih</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option>Bugün</option>
                  <option>Dün</option>
                  <option>Bu Hafta</option>
                  <option>Bu Ay</option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Tarihi</label>
                <input type="text" defaultValue="20.09.2026" className="w-full text-sm outline-none bg-transparent" />
                <div className="absolute right-0 bottom-1.5 text-gray-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                </div>
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Başlangıç Saati</label>
                <input type="text" defaultValue="06:00" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Bitiş Saati*</label>
                <input type="text" defaultValue="23:45" className="w-full text-sm outline-none bg-transparent" />
              </div>

              <div className="relative border-b border-gray-300 pb-1">
                <label className="block text-[11px] text-gray-500 mb-1">Sipariş Tipi</label>
                <select className="w-full text-sm outline-none bg-transparent appearance-none">
                  <option></option>
                </select>
                <ChevronRight className="absolute right-0 bottom-2 w-4 h-4 text-gray-400 rotate-90" />
              </div>

            </div>

            {/* Drawer Footer */}
            <div className="p-6">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 text-[14px] font-medium text-white bg-[#dc3545] rounded hover:bg-red-700 transition-colors"
              >
                Filtrele
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
