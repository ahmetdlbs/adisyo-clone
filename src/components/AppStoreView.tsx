"use client";

import React, { useState } from "react";
import { Search, Grid, Store, ShoppingBag, CreditCard, Truck, RefreshCw, FileText, Building, Heart, Plus, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AppStoreView() {
  const [activeTab, setActiveTab] = useState<"store" | "installed">("store");
  const [activeCategory, setActiveCategory] = useState("Tüm Uygulamalar");

  const categories = [
    { name: "Tüm Uygulamalar", count: 29, icon: Grid },
    { name: "Restoran Operasyon", count: 3, icon: Store },
    { name: "Paket Sipariş", count: 8, icon: ShoppingBag },
    { name: "Ödeme Yöntemi", count: 6, icon: CreditCard },
    { name: "Kurye", count: 4, icon: Truck },
    { name: "E-Dönüşüm", count: 3, icon: RefreshCw },
    { name: "Veri Aktarımı & API", count: 1, icon: FileText },
    { name: "Otel", count: 3, icon: Building },
    { name: "Müşteri Sadakat", count: 1, icon: Heart },
  ];

  const suggestedApps = [
    { name: "QRall (Dijital Menü)", price: "+₺435 / ay", iconColor: "bg-black", iconLetter: "Q" },
    { name: "Yemek Sepeti (Deliveryhero)", price: "+₺225 / ay", iconColor: "bg-[#ea004b]", iconLetter: "Y" },
    { name: "Getir Yemek", price: "+₺225 / ay", iconColor: "bg-[#5d3ebd]", iconLetter: "g" },
    { name: "Trendyol Yemek", price: "+₺225 / ay", iconColor: "bg-[#f27a1a]", iconLetter: "t" },
  ];

  const operationApps = [
    {
      name: "Müşteri Bilgi Ekranı",
      description: "Sipariş alırken müşteriye anlık sepet özeti gösterin, şeffaf ve güven veren bir deneyim...",
      iconColor: "bg-[#475569]",
      iconLetter: "M",
      status: "installed",
      price: null,
    },
    {
      name: "Android Caller ID",
      description: "Gelen aramaları bilgisayarınıza ileterek arayan müşterinin sipariş ve iletişim bilgilerini anında...",
      iconColor: "bg-[#047857]",
      iconLetter: "C",
      status: "installed",
      price: null,
    },
    {
      name: "Müşteri Memnuniyeti",
      description: "Fişteki QR ile müşterilerinizden anket yanıtı toplayın.",
      iconColor: "bg-[#8b5cf6]",
      iconLetter: "MM",
      status: "pro",
      price: "Pro Plan",
    },
  ];

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#f6f7fb] p-8 font-sans">
      
      {/* Header section without icon, just text and tabs */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold text-[#1f2937] mb-1 tracking-tight">Uygulama Mağazası</h1>
        <p className="text-[14px] text-[#6b7280]">İşletmenizi büyütmek için ihtiyacınız olan tüm çözümleri tek noktadan yönetin.</p>
        
        {/* Tabs */}
        <div className="flex items-center gap-6 mt-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab("store")}
            className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${activeTab === "store" ? "border-red-600 text-gray-900 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700 font-medium"}`}
          >
            <span className="text-[15px]">Mağaza</span>
            <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[11px] font-bold">29</span>
          </button>
          <button 
            onClick={() => setActiveTab("installed")}
            className={`flex items-center gap-2 pb-3 border-b-2 transition-all ${activeTab === "installed" ? "border-red-600 text-gray-900 font-semibold" : "border-transparent text-gray-500 hover:text-gray-700 font-medium"}`}
          >
            <span className="text-[15px]">Kurulu Uygulamalarım</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[11px] font-bold">7</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Sidebar */}
        <div className="w-full lg:w-[240px] shrink-0">
          <h3 className="text-[11px] font-semibold text-gray-400 tracking-wider mb-3 uppercase px-2">Kategoriler</h3>
          <div className="flex flex-col gap-1 mb-8">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive 
                      ? "bg-[#333333] text-white shadow-sm" 
                      : "text-[#4b5563] hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? "text-white" : "text-gray-400"} />
                    <span>{cat.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Warning Box */}
          <div className="bg-[#fff1f2] border border-[#fecdd3] rounded-xl p-5 shadow-sm relative overflow-hidden">
            <h4 className="text-[13px] font-bold text-[#b91c1c] mb-1">1 uygulamada yenileme yakın</h4>
            <p className="text-[12px] text-[#e11d48] mb-4 leading-snug opacity-90">Kesinti yaşamamak için paketlerinizi yenileyin.</p>
            <button className="w-full bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-semibold py-2.5 rounded-lg transition-colors shadow-sm">
              Sorunları Gör
            </button>
          </div>
        </div>

      {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100 p-3.5 flex items-center gap-3">
            <Search className="text-gray-400 ml-1" size={20} />
            <input 
              type="text"
              placeholder="Entegre etmek istediğiniz platformu bulun.."
              className="w-full text-[15px] outline-none bg-transparent placeholder-gray-400 text-gray-800"
            />
          </div>

          {/* Upgrade Banner - Only show on 'Tüm Uygulamalar' */}
          {activeCategory === "Tüm Uygulamalar" && (
            <div className="bg-[#fff6f5] border border-[#fbd5d5] rounded-xl flex flex-col md:flex-row overflow-hidden shadow-sm">
              {/* Left side */}
              <div className="p-8 md:w-1/2 border-b md:border-b-0 md:border-r border-[#fbd5d5]">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-[20px] font-bold text-[#1f2937]">Planınızı Büyütün</h2>
                  <span className="bg-[#b91c1c] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide">ADİSYO PAKETLERİ</span>
                </div>
                <p className="text-[13px] text-gray-500 mb-6">Planınızı yükseltin ya da ihtiyacınız olan modülü tek tek ekleyin.</p>
                
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h3 className="text-[11px] font-bold text-gray-400 tracking-wider mb-2 uppercase">MEVCUT PLANINIZ</h3>
                  <div className="flex items-center gap-4 mb-6">
                    <h4 className="text-[18px] font-bold text-gray-800">Deneme Paketi</h4>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-[15%] h-full bg-gray-300 rounded-full"></div>
                    </div>
                  </div>

                  <h3 className="text-[13px] font-bold text-gray-800 mb-3">Pro ile açılan modüller</h3>
                  <ul className="flex flex-col gap-2.5 mb-6">
                    {["Müşteri Sadakat modülü", "Otel Yönetim modülü", "Rapor Sihirbazı modülü", "Maliyet ve Kârlılık modülü"].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0">
                          <Plus size={14} />
                        </div>
                        <span className="text-[13px] text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="bg-[#b91c1c] hover:bg-[#991b1b] text-white text-[13px] font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                    Paketi Yükselt
                  </button>
                </div>
              </div>

              {/* Right side */}
              <div className="p-8 md:w-1/2 bg-[#fff6f5]">
                <h3 className="text-[15px] font-bold text-gray-800 mb-5">Size Önerilenler</h3>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4">
                  {suggestedApps.map((app, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${app.iconColor} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                          {app.iconLetter}
                        </div>
                        <span className="text-[14px] font-medium text-gray-800">{app.name}</span>
                      </div>
                      <span className="text-[13px] font-bold text-gray-900">{app.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Module List Section */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-[18px] font-bold text-[#1f2937]">
                {activeCategory === "Tüm Uygulamalar" ? "Restoran Operasyon Modülleri" : activeCategory + " Uygulamaları"}
              </h3>
              <span className="text-[14px] text-gray-400 font-medium">
                {activeCategory === "Tüm Uygulamalar" ? operationApps.length : Math.floor(Math.random() * 5) + 1} uygulama
              </span>
            </div>
            
            {activeCategory === "Tüm Uygulamalar" && (
              <p className="text-[13px] text-gray-500 mb-6">İşletme yönetimini daha verimli, düzenli ve kontrol edilebilir hale getirin.</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* If "Tüm Uygulamalar" or "Restoran Operasyon", show real list. Otherwise show dummy cards based on category */}
              {(activeCategory === "Tüm Uygulamalar" || activeCategory === "Restoran Operasyon" ? operationApps : [
                {
                  name: activeCategory + " Modülü 1",
                  description: `${activeCategory} işlemlerinizi kolayca yönetmenizi sağlayan entegrasyon aracı.`,
                  iconColor: "bg-[#3b82f6]",
                  iconLetter: activeCategory.charAt(0),
                  status: "free",
                  price: "Ücretsiz",
                },
                {
                  name: activeCategory + " Premium",
                  description: `Gelişmiş ${activeCategory} özellikleri ile rakiplerinizin bir adım önüne geçin.`,
                  iconColor: "bg-[#10b981]",
                  iconLetter: activeCategory.charAt(0),
                  status: "pro",
                  price: "+₺99 / ay",
                }
              ]).map((app, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${app.iconColor} flex items-center justify-center text-white font-bold shadow-sm shrink-0`}>
                      {app.iconLetter}
                    </div>
                    <h4 className="text-[15px] font-bold text-gray-800 leading-tight">{app.name}</h4>
                  </div>
                  
                  <p className="text-[13px] text-gray-500 leading-relaxed flex-1 mb-5">
                    {app.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    {app.status === "installed" ? (
                      <span className="text-[13px] font-semibold text-transparent">Boş</span>
                    ) : (
                      <span className="text-[13px] font-bold text-gray-800">{app.price}</span>
                    )}

                    {app.status === "installed" ? (
                      <button className="bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors">
                        Yönet
                      </button>
                    ) : (
                      <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                        <Plus size={16} /> Ekle
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
