"use client";

import React, { useState } from "react";
import { Printer, Settings, AlertTriangle, CheckCircle2, PlayCircle, Download, Plus } from "lucide-react";
import Link from "next/link";

export default function PrinterSettingsView() {
  const [activeTab, setActiveTab] = useState<"printers" | "design">("printers");
  const [selectedPrinterType, setSelectedPrinterType] = useState<"multi" | "single">("multi");

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#f3f4f6] p-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-[#f97316] w-14 h-14 rounded-md flex items-center justify-center text-white shrink-0">
            <Printer size={28} />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold text-gray-800">Yazıcı Ayarları</h1>
            <p className="text-[13px] text-gray-500 mt-1">Yazıcı ile ilgili ayarlarınızı buradan yönetebilirsiniz</p>
          </div>
        </div>
        
        <div className="flex bg-gray-100 rounded-md p-1 border border-gray-200 self-stretch md:self-auto">
          <button 
            onClick={() => setActiveTab("printers")}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "printers" ? "bg-white text-red-500 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Printer size={16} />
            <span>Yazıcılar</span>
          </button>
          <button 
            onClick={() => setActiveTab("design")}
            className={`flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "design" ? "bg-white text-red-500 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
          >
            <Settings size={16} />
            <span>Çıktı Tasarımı</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === "printers" ? (
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column (Main) */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* Info Alert */}
            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-4 flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              </div>
              <p className="text-[14px] text-blue-900 leading-relaxed font-medium">
                Bu ekranda WebUSB ile bağlanan yazıcılar görüntülenmez. Bu yazıcıların çıktı ayarlarını "Çıktı Tasarımı" sekmesinden düzenleyebilirsiniz.
              </p>
            </div>

            {/* Empty State */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg flex-1 min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="text-red-400 mb-4 relative">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
                  <path d="M12 2L1 21h22L12 2zm0 3.83L19.5 19H4.5L12 5.83zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
                </svg>
                {/* Simulated dots around the warning icon like in Adisyo design */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="absolute top-1 right-3 w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="absolute top-8 -left-2 w-2 h-2 bg-red-400 rounded-full"></div>
                  <div className="absolute top-10 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              </div>
              <h2 className="text-[22px] font-bold text-gray-800 mb-2">Tanımlı Yazıcı Bulunamadı.</h2>
              <p className="text-[14px] text-gray-500">Lütfen ekranın sağ tarafında bulunan işlemleri sırasıyla yapınız</p>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0">
            
            {/* Yazıcı Modeli */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-[16px] font-semibold text-gray-800">Yazıcı Modeli</h3>
              </div>
              <div className="p-5 flex flex-col gap-3">
                <div 
                  onClick={() => setSelectedPrinterType("multi")}
                  className={`relative p-4 border rounded-md cursor-pointer transition-all ${selectedPrinterType === "multi" ? "border-red-200 bg-red-50/30" : "border-gray-200 hover:border-red-200"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${selectedPrinterType === "multi" ? "text-red-500" : "text-gray-400"}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 12h12"></path><path d="M6 12v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"></path><path d="M6 12v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-6"></path><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[14px] font-medium ${selectedPrinterType === "multi" ? "text-red-600" : "text-gray-700"}`}>Birden Fazla Yazıcı (USB veya Ethernet)</h4>
                      <p className="text-[12px] text-gray-500 mt-1">Ürün bazlı (mutfak, bar vb.) yazdırma</p>
                    </div>
                  </div>
                  {selectedPrinterType === "multi" && (
                    <div className="absolute top-4 right-4 text-red-500">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>

                <div 
                  onClick={() => setSelectedPrinterType("single")}
                  className={`relative p-4 border rounded-md cursor-pointer transition-all ${selectedPrinterType === "single" ? "border-red-200 bg-red-50/30" : "border-gray-200 hover:border-red-200"}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${selectedPrinterType === "single" ? "text-red-500" : "text-gray-400"}`}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[14px] font-medium ${selectedPrinterType === "single" ? "text-red-600" : "text-gray-700"}`}>Tek Yazıcı (USB)</h4>
                      <p className="text-[12px] text-gray-500 mt-1">Basit ve hızlı bağlantı</p>
                    </div>
                  </div>
                  {selectedPrinterType === "single" && (
                    <div className="absolute top-4 right-4 text-red-500">
                      <CheckCircle2 size={20} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Keşfet */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="text-[16px] font-semibold text-gray-800">Keşfet</h3>
              </div>
              <div className="p-5">
                <p className="text-[13px] text-gray-600 mb-4 leading-relaxed">
                  Yazıcılarınızın kurulumu ve Adisyo programına tanıtılması adımlarını anlattığımız videoyu izlemek için aşağıdaki bağlantıları kullanabilirsiniz.
                </p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:border-red-200 transition-colors group">
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-red-600">Ethernet Bağlantılı Yazıcı Tanımlama</span>
                    <PlayCircle size={18} className="text-red-500" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 border border-gray-200 rounded-md hover:border-red-200 transition-colors group">
                    <span className="text-[13px] font-medium text-gray-700 group-hover:text-red-600">USB Bağlantılı Yazıcı Tanımlama</span>
                    <PlayCircle size={18} className="text-red-500" />
                  </a>
                </div>
              </div>
            </div>

            {/* Kuruluma Başla */}
            <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 bg-white">
                <h3 className="text-[16px] font-semibold text-gray-800">Kuruluma Başla</h3>
              </div>
              <div className="p-5 flex flex-col gap-6">
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <h4 className="text-[14px] font-semibold text-gray-800 mb-1">Bulut Yazıcı Programını İndir</h4>
                  <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
                    Adisyo bulut yazıcı programı, bilgisayarınıza tanımlı yazıcılar ile Adisyo programı arasındaki iletişimi sağlayarak, çok daha güzel çıktılar almanızı sağlar
                  </p>
                  <button className="w-full py-2.5 bg-[#93c5fd] hover:bg-[#60a5fa] text-[#1e3a8a] font-medium text-[13px] rounded transition-colors flex items-center justify-center gap-2">
                    <Download size={16} />
                    Bulut Yazıcı Programını İndir
                  </button>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 bg-red-100 text-red-500 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <h4 className="text-[14px] font-semibold text-gray-800 mb-1">Yeni Yazıcı Ekle</h4>
                  <p className="text-[12px] text-gray-500 mb-3 leading-relaxed">
                    Adisyo bulut yazıcı programını bilgisayarınıza kurduktan sonra yeni yazıcınızı sisteme tanıtabilirsiniz.
                  </p>
                  <button className="w-full py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white font-medium text-[13px] rounded transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <Plus size={16} />
                    Yeni Yazıcı Ekle
                  </button>
                </div>

              </div>
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg h-[600px] flex flex-col items-center justify-center p-8 text-center shadow-sm">
          <div className="text-red-400 mb-4 relative">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="opacity-90">
              <path d="M12 2L1 21h22L12 2zm0 3.83L19.5 19H4.5L12 5.83zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
            </svg>
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="absolute top-1 right-3 w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="absolute top-8 -left-2 w-2 h-2 bg-red-400 rounded-full"></div>
              <div className="absolute top-10 -right-1 w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
          </div>
          <h2 className="text-[22px] font-bold text-gray-800 mb-2">Aktif yazıcı bulunamadı</h2>
          <p className="text-[14px] text-gray-500 max-w-md">
            Aktif bir yazıcı bulunamadığı için çıktı tasarımı oluşturulamadı. Lütfen bilgisayarınıza bağlı yazıcıları kontrol ediniz.
          </p>
        </div>
      )}

    </div>
  );
}
