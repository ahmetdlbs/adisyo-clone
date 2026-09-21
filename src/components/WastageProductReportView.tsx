"use client";

import React, { useState } from "react";
import { ChevronRight, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";

type TabKey = "fire_raporu";

export default function WastageProductReportView() {
  const [activeTab, setActiveTab] = useState<TabKey>("fire_raporu");

  const TABS = [
    { id: "fire_raporu", label: "Fire Raporu" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#f3f4f6]">
      {/* Sidebar */}
      <div className="w-[260px] flex-shrink-0 bg-[#e5e7eb]/50 border-r border-gray-200">
        <div className="py-4">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabKey)}
              className={`w-full flex items-center justify-between px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === tab.id 
                  ? "bg-gray-200/80 text-gray-900" 
                  : "text-gray-800 hover:bg-gray-200/50"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <ChevronRight size={16} className="text-gray-500" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)] bg-[#f3f4f6]">
        
        {/* Content */}
        <div className="p-8 max-w-5xl">
          <div className="space-y-8">
            
            {/* Section 1 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-yellow-500">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#FBBF24"/>
                    <path d="M12 16V12M12 8H12.01" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-base font-bold text-gray-900">Fire Tanımı Nedir?</h2>
              </div>
              <p className="text-[15px] text-gray-800 leading-relaxed ml-[36px]">
                Bu ekran, seçili hammadde ürünleriniz için fire miktarını takip edebilmenizi sağlar. Ürün bazında beklenen ve kabul edilebilir fire oranlarını girerek, gün sonunda gerçekleşen fire miktarlarını analiz edebilirsiniz. Fire takibi, hammadde israfını azaltarak maliyet kontrolü sağlamanıza yardımcı olur.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-green-500">
                  <CheckCircle2 size={24} fill="#22c55e" stroke="white" />
                </div>
                <h2 className="text-base font-bold text-gray-900">Nasıl Aktif Edilir?</h2>
              </div>
              <div className="space-y-6 ml-[36px]">
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Fire modülü ile ilgili ücretlendirme ve detaylı bilgi için <a href="mailto:info@adisyo.com" className="text-blue-500 hover:underline">info@adisyo.com</a> adresine yazabilir veya <a href="tel:02167060624" className="text-blue-500 hover:underline">0216 706 06 24</a> numaralı satış hattımızdan bizimle iletişime geçebilirsiniz.
                </p>
                <p className="text-[15px] text-gray-800 leading-relaxed">
                  Fire yüzdesinin hesaplanabilmesi için, gün başı ve gün sonu işlemleri sırasında ilgili ürünlerin çiğ ve pişmiş miktarlarını girmeniz gerekmektedir. Bu işlemin yapılabilmesi için, <Link href="/table-area-definition" className="text-blue-500 hover:underline">Parametreler</Link> bölümünde <span className="font-bold">'Gün başı-gün sonu manuel yapılsın'</span> seçeneğinin aktif olduğundan emin olunuz.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
