"use client";

import React from "react";
import { Gift, Share2, Copy, CheckCircle2, Award, Users } from "lucide-react";

export default function ReferralView() {
  const referralLink = "https://adisyo.com/tr/kayit?ref=AHMET123";

  return (
    <div className="flex flex-col min-h-full overflow-y-auto bg-[#f3f4f6] p-6">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-lg shadow-sm border border-red-700 mb-6 flex flex-col md:flex-row items-center p-8 gap-8 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-white opacity-10 rounded-full"></div>

        <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center text-white shrink-0 backdrop-blur-sm relative z-10 border border-white/30 shadow-inner">
          <Gift size={40} />
        </div>
        
        <div className="relative z-10 text-center md:text-left text-white">
          <h1 className="text-[28px] font-bold mb-2">Tavsiye Et ve Kazan!</h1>
          <p className="text-[15px] text-red-50 max-w-xl leading-relaxed">
            Adisyo'yu çevrenizdeki işletmelere tavsiye edin, onların da işlerini kolaylaştırmasını sağlayın. Sizin referansınızla kayıt olan her yeni işletme için <strong className="text-white bg-white/20 px-2 py-0.5 rounded">ekstra kullanım süresi</strong> ve sürpriz ödüller kazanın!
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Link & Stats */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Share Link Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-red-100 p-2 rounded text-red-600">
                <Share2 size={20} />
              </div>
              <h2 className="text-[18px] font-semibold text-gray-800">Referans Bağlantınız</h2>
            </div>
            
            <p className="text-[14px] text-gray-500 mb-4">
              Aşağıdaki bağlantıyı kopyalayarak WhatsApp, e-posta veya sosyal medya üzerinden paylaşabilirsiniz.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 bg-gray-50 border border-gray-300 rounded-md flex items-center px-4 py-3">
                <span className="text-[15px] text-gray-800 font-medium select-all">{referralLink}</span>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  // In a real app we would show a toast here
                  alert("Kopyalandı!");
                }}
                className="bg-[#dc3545] hover:bg-red-700 text-white px-6 py-3 rounded-md font-medium text-[14px] flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0"
              >
                <Copy size={18} />
                Bağlantıyı Kopyala
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-[18px] font-semibold text-gray-800 mb-6">Nasıl Çalışır?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-6 left-[16%] right-[16%] h-0.5 bg-gray-100 z-0"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-red-200 text-red-500 flex items-center justify-center font-bold text-lg mb-4 shadow-sm">1</div>
                <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Bağlantıyı Paylaşın</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Referans linkinizi çevrenizdeki diğer restoran veya kafelerle paylaşın.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white border-2 border-red-200 text-red-500 flex items-center justify-center font-bold text-lg mb-4 shadow-sm">2</div>
                <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Kayıt Olsunlar</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Paylaştığınız link üzerinden sisteme kayıt olup kullanıma başlasınlar.</p>
              </div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-red-500 border-2 border-red-500 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-800 mb-2">Ödülünüzü Kazanın</h3>
                <p className="text-[13px] text-gray-500 leading-relaxed">Referansınızla gelen her aktif müşteri için hesabınıza ödülünüz tanımlansın.</p>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Stats */}
        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center gap-2">
              <Award className="text-yellow-500" size={20} />
              <h3 className="text-[16px] font-semibold text-gray-800">İstatistikleriniz</h3>
            </div>
            
            <div className="p-5 flex flex-col gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1 uppercase tracking-wider">TOPLAM TIKLAMA</p>
                  <p className="text-[24px] font-bold text-gray-800">42</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                  <Share2 size={20} />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-gray-500 font-medium mb-1 uppercase tracking-wider">KAYIT OLANLAR</p>
                  <p className="text-[24px] font-bold text-gray-800">3</p>
                </div>
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>

              <div className="bg-red-50 p-4 rounded-lg border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-red-600 font-medium mb-1 uppercase tracking-wider">KAZANILAN ÖDÜL</p>
                  <p className="text-[24px] font-bold text-red-700">3 Ay</p>
                </div>
                <div className="w-10 h-10 bg-red-200 text-red-700 rounded-full flex items-center justify-center">
                  <Gift size={20} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
