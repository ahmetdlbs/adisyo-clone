"use client";

import React, { useState } from "react";
import {
  Layers,
  Users,
  BarChart3,
  ArrowUpDown,
  LayoutGrid,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface DashboardViewProps {
  openOrdersTotal: number;
  guestCount: number;
}

export default function DashboardView({
  openOrdersTotal,
  guestCount,
}: DashboardViewProps) {
  const [hoveredHour, setHoveredHour] = useState<number | null>(16);

  const hours = Array.from({ length: 25 }, (_, i) => i);
  const getSalesForHour = (hour: number) => {
    if (hour === 15) return 45;
    if (hour === 16) return 367;
    if (hour === 17) return 60;
    return 0;
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full select-none">
      {/* Section 1: GENEL DURUM */}
      <div className="mb-12">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6b7280] mb-8">
          GENEL DURUM
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
          {/* Card 1: Toplam Satış Tutarı */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-orange-500 to-orange-400 text-white flex items-center justify-center shadow-lg">
              <Layers className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Bugünkü toplam satış tutarı</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Gün sonu raporu</span>
            </div>
          </div>

          {/* Card 2: Misafir Sayısı */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-sky-500 to-sky-400 text-white flex items-center justify-center shadow-lg">
              <Users className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Bugün ağırlanan misafir sayısı</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">{guestCount}</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-transparent select-none">-</span>
            </div>
          </div>

          {/* Card 3: Açık Sipariş Toplamı */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-green-500 to-green-400 text-white flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Bugün açık sipariş toplamı</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺{openOrdersTotal.toFixed(2).replace(".", ",")}</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-transparent select-none">-</span>
            </div>
          </div>

          {/* Card 4: Toplam Gider Tutarı */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-rose-500 to-rose-400 text-white flex items-center justify-center shadow-lg">
              <ArrowUpDown className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Bugünkü toplam gider tutarı</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Masraflar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: FİNANSAL ANALİZ & KÂRLILIK */}
      <div className="mb-12">
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#6b7280] mb-8">
          FİNANSAL ANALİZ & KÂRLILIK
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 gap-y-12">
          {/* Card 1: Toplam Stok Maliyeti */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-purple-500 to-purple-400 text-white flex items-center justify-center shadow-lg">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Toplam Stok Maliyeti</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Depodaki Ürün Maliyeti</span>
            </div>
          </div>

          {/* Card 2: Satılan Ürün Maliyeti */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-400 text-white flex items-center justify-center shadow-lg">
              <Receipt className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Satılan Ürün Maliyeti</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Gerçek Satış Maliyeti</span>
            </div>
          </div>

          {/* Card 3: Brüt Kâr */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-teal-500 to-teal-400 text-white flex items-center justify-center shadow-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Brüt Kâr</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Ciro - Satılan Ürün Maliyeti</span>
            </div>
          </div>

          {/* Card 4: Net Kâr */}
          <div className="bg-white rounded-lg shadow-sm border border-[#e5e7eb] relative px-4 pb-4 pt-4">
            <div className="absolute -top-5 left-4 w-16 h-16 rounded-lg bg-gradient-to-tr from-cyan-500 to-cyan-400 text-white flex items-center justify-center shadow-lg">
              <Wallet className="w-8 h-8" />
            </div>
            <div className="text-right pl-20">
              <span className="text-[13px] text-[#6b7280] block">Net Kâr</span>
              <div className="text-2xl font-bold text-[#374151] mt-1">₺0,00</div>
            </div>
            <div className="border-t border-[#f3f4f6] mt-4 pt-3 text-right">
              <span className="text-[12px] text-[#9ca3af]">Brüt Kâr - Giderler</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Günlük Satış Miktarları Chart */}
      <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-[#111827]">
            Günlük Satış Miktarları
          </h3>
          <span className="text-xs text-[#9ca3af]">Tutar(₺)</span>
        </div>

        <div className="h-64 w-full relative">
          <svg viewBox="0 0 1000 240" className="w-full h-full overflow-visible">
            <line x1="40" y1="20" x2="980" y2="20" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="40" y1="80" x2="980" y2="80" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="40" y1="140" x2="980" y2="140" stroke="#f1f5f9" strokeDasharray="3 3" />
            <line x1="40" y1="200" x2="980" y2="200" stroke="#e5e7eb" />

            <text x="30" y="24" fontSize="10" fill="#9ca3af" textAnchor="end">400.00</text>
            <text x="30" y="84" fontSize="10" fill="#9ca3af" textAnchor="end">300.00</text>
            <text x="30" y="144" fontSize="10" fill="#9ca3af" textAnchor="end">200.00</text>
            <text x="30" y="204" fontSize="10" fill="#9ca3af" textAnchor="end">0.00</text>

            <path
              d="M 50 200 L 600 200 C 630 200, 650 35, 663 35 C 676 35, 696 200, 726 200 L 970 200"
              fill="none"
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
            />

            <path
              d="M 50 200 L 600 200 C 630 200, 650 35, 663 35 C 676 35, 696 200, 726 200 L 970 200 L 970 200 L 50 200 Z"
              fill="url(#chartGrad)"
              opacity="0.25"
            />

            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            <circle cx="663" cy="35" r="5" fill="#f97316" stroke="#ffffff" strokeWidth="2" />

            {hours.map((h) => {
              const x = 50 + h * 38.3;
              return (
                <g key={h}>
                  <circle
                    cx={x}
                    cy={h === 16 ? 35 : 200}
                    r={h === 16 ? 4 : 2.5}
                    fill={h === 16 ? "#f97316" : "#eab308"}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredHour(h)}
                  />
                  {h % 2 === 0 && (
                    <text
                      x={x}
                      y="222"
                      fontSize="9"
                      fill="#6b7280"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {h < 10 ? `0${h}:00` : `${h}:00`}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {hoveredHour === 16 && (
            <div className="absolute left-[64%] top-0 -translate-x-1/2 bg-gray-900 text-white text-[11px] px-2.5 py-1 rounded shadow-lg pointer-events-none">
              16:00 - ₺367,00
            </div>
          )}
        </div>
      </div>

      {/* Section 4: Dual Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-5 shadow-2xs">
          <h3 className="font-semibold text-sm text-[#111827] mb-4">
            Bugün Yapılan Ödemeler
          </h3>
          <div className="h-40 flex flex-col items-center justify-center text-[#9ca3af] text-xs">
            <Receipt className="w-8 h-8 text-[#d1d5db] mb-2" />
            <span>Henüz tamamlanan tahsilat bulunmuyor</span>
          </div>
        </div>

        <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-5 shadow-2xs">
          <h3 className="font-semibold text-sm text-[#111827] mb-4">
            Masa Yoğunluğu (%)
          </h3>
          <div className="h-40 flex items-center justify-center gap-8">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3.8"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#0d9488"
                  strokeWidth="3.8"
                  strokeDasharray="10, 90"
                  strokeDashoffset="0"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-bold text-[#111827]">%10</span>
                <span className="text-[9px] text-[#9ca3af] block">Dolu</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#0d9488]" />
                <span className="text-[#374151]">Dolu Masalar: 1 adet (%10)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#e5e7eb]" />
                <span className="text-[#6b7280]">Boş Masalar: 9 adet (%90)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
