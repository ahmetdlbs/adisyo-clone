"use client";

import React from "react";
import { Edit } from "lucide-react";

export default function AccountInfoView() {
  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#eef1f6] p-6 lg:p-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 max-w-7xl mx-auto w-full">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          
          {/* HESABINIZ Card */}
          <div className="bg-[#f8f9fb] rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="px-6 py-4 border-b border-transparent">
              <h2 className="text-[14px] font-bold tracking-wider text-gray-800 uppercase">HESABINIZ</h2>
            </div>
            
            <div className="px-6 pb-6">
              <div className="bg-[#f0ece9] rounded-lg p-5">
                <div className="mb-4">
                  <p className="text-[12px] text-gray-500 mb-1">Aktif Paketiniz</p>
                  <h3 className="text-[16px] font-bold text-gray-900">Trial paket</h3>
                  <p className="text-[12px] text-gray-500 mt-0.5">Sınırsız Kullanıcı</p>
                </div>
                
                <div className="h-px bg-gray-300 my-4"></div>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[13px] text-gray-700 font-medium">Üyelik Tarihiniz</span>
                  <span className="text-[13px] text-gray-900">19.09.2026 16:21</span>
                </div>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[13px] text-gray-700 font-medium">Üyelik Bitiş Tarihiniz</span>
                  <span className="text-[13px] text-gray-900">05.10.2026 10:21</span>
                </div>
                
                <div className="w-full h-1 bg-gray-300 rounded-full mb-2 overflow-hidden">
                  <div className="h-full bg-[#dc2626] w-[6%]"></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-[11px] text-gray-600 font-medium">Kullanılan 1 gün (6%)</span>
                  <span className="text-[11px] text-gray-600 font-medium">Kalan 14 gün (93%)</span>
                </div>
              </div>

              <button className="w-full mt-4 bg-[#cc3333] hover:bg-[#b32b2b] text-white py-3 rounded-lg text-[14px] font-semibold transition-colors shadow-sm">
                Süreyi Uzat/Ödeme Yap
              </button>
            </div>
          </div>

          {/* ÖDEME YÖNETİMİ Card */}
          <div className="bg-[#f8f9fb] rounded-xl shadow-sm border border-gray-200/60 overflow-hidden">
            <div className="px-6 py-4 flex justify-between items-center">
              <h2 className="text-[14px] font-bold tracking-wider text-gray-800 uppercase">ÖDEME YÖNETİMİ</h2>
              <button className="flex items-center gap-1.5 text-[#cc3333] hover:text-[#b32b2b] text-[13px] font-semibold transition-colors">
                <Edit size={14} />
                Düzenle
              </button>
            </div>
            
            <div className="px-6 pb-6 flex flex-col gap-5">
              <div>
                <h3 className="text-[14px] font-semibold text-gray-800 mb-2">Ödeme Metodu</h3>
                <button className="text-[#cc3333] hover:text-[#b32b2b] text-[13px] font-medium transition-colors mb-1">
                  + Kartınızı Kaydedin
                </button>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Kartınızı kaydedin, ödemelerinizi hızlı ve zahmetsiz yapın.
                </p>
              </div>
              
              <div className="h-px bg-gray-200"></div>
              
              <div>
                <h3 className="text-[14px] font-semibold text-gray-800 mb-2">Talimat Detayları</h3>
                <button className="text-[#cc3333] hover:text-[#b32b2b] text-[13px] font-medium transition-colors mb-1">
                  + Otomatik Ödeme Talimatı Verin
                </button>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Belirlediğiniz karttan düzenli tahsilat yapılır; ödeme gecikmesi ya da hizmet kesintisi riski ortadan kalkar.
                </p>
              </div>

              <div className="h-px bg-gray-200"></div>
              
              <div>
                <h3 className="text-[14px] font-semibold text-gray-800">Fatura Bilgileri</h3>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: ÖDEMELER Card */}
        <div className="bg-[#f8f9fb] rounded-xl shadow-sm border border-gray-200/60 overflow-hidden h-fit min-h-[500px]">
          <div className="px-6 py-4 border-b border-transparent">
            <h2 className="text-[14px] font-bold tracking-wider text-gray-800 uppercase">ÖDEMELER</h2>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#e9ecef] border-b border-gray-200 text-gray-500 text-[11px] font-bold tracking-wider uppercase">
                  <th className="py-3 px-6 font-semibold">DURUMU</th>
                  <th className="py-3 px-6 font-semibold">PLAN</th>
                  <th className="py-3 px-6 font-semibold">ENTEGRASYONLAR</th>
                  <th className="py-3 px-6 font-semibold">TUTAR</th>
                  <th className="py-3 px-6 font-semibold">ÖDEME TARİHİ</th>
                  <th className="py-3 px-6 font-semibold">ÖDEME TİPİ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="py-5 px-6 text-[14px] text-gray-700 bg-[#f8f9fb]">
                    Kayıtlı ödeme bulunamadı!
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
