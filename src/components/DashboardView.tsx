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
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-3">
          GENEL DURUM
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Toplam Satış Tutarı (Orange) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#f97316] text-white flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Bugünkü toplam satış tutarı
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Gün sonu raporu
              </div>
            </div>
          </div>

          {/* Card 2: Misafir Sayısı (Blue) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#0284c7] text-white flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Bugün ağırlanan misafir sayısı
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                {guestCount}
              </div>
            </div>
          </div>

          {/* Card 3: Açık Sipariş Toplamı (Green) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#16a34a] text-white flex items-center justify-center shrink-0">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Bugün açık sipariş toplamı
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺{openOrdersTotal.toFixed(2).replace(".", ",")}
              </div>
            </div>
          </div>

          {/* Card 4: Toplam Gider Tutarı (Pink) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#db2777] text-white flex items-center justify-center shrink-0">
              <ArrowUpDown className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Bugünkü toplam gider tutarı
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Masraflar
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: FİNANSAL ANALİZ & KÂRLILIK */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-3">
          FİNANSAL ANALİZ & KÂRLILIK
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Toplam Stok Maliyeti (Purple) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#9333ea] text-white flex items-center justify-center shrink-0">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Toplam Stok Maliyeti
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Depodaki Ürün Maliyeti
              </div>
            </div>
          </div>

          {/* Card 2: Satılan Ürün Maliyeti (Indigo) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#4f46e5] text-white flex items-center justify-center shrink-0">
              <Receipt className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Satılan Ürün Maliyeti
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Gerçek Satış Maliyeti
              </div>
            </div>
          </div>

          {/* Card 3: Brüt Kâr (Teal) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#0d9488] text-white flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Brüt Kâr
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Ciro - Satılan Ürün Maliyeti
              </div>
            </div>
          </div>

          {/* Card 4: Net Kâr (Cyan) */}
          <div className="bg-white rounded-[6px] border border-[#e5e7eb] p-4 shadow-2xs flex items-start gap-4">
            <div className="w-12 h-12 rounded-[4px] bg-[#0891b2] text-white flex items-center justify-center shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs text-[#6b7280] block truncate">
                Net Kâr
              </span>
              <div className="text-xl font-bold text-[#111827] mt-0.5">
                ₺0,00
              </div>
              <div className="text-[11px] text-[#9ca3af] mt-1">
                Brüt Kâr - Giderler
              </div>
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
