"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Info, ChevronDown } from "lucide-react";

export default function OnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 States
  const [workTypes, setWorkTypes] = useState<string[]>(['Masa Siparişi']);
  const [paymentTypes, setPaymentTypes] = useState<string[]>(['Nakit', 'Kredi Kartı']);

  // Step 2 States
  const [kitchenDelivery, setKitchenDelivery] = useState('Her İkisi');
  const [paymentTime, setPaymentTime] = useState('Karışık');
  const [receiptGiven, setReceiptGiven] = useState('Opsiyonel');
  const [businessType, setBusinessType] = useState('Cafe');

  const toggleSelection = (state: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    if (state.includes(value)) {
      setter(state.filter(item => item !== value));
    } else {
      setter([...state, value]);
    }
  };

  const steps = [
    { id: 1, title: 'Çalışma Ayarlarınız' },
    { id: 2, title: 'İşletme Bilgileriniz' },
    { id: 3, title: 'Harika! Her Şey Hazır' }
  ];

  return (
    <div className="flex min-h-screen bg-[#fafafa] relative overflow-hidden font-sans">
      
      {/* Background Graphic */}
      <div className="absolute bottom-0 right-0 w-[800px] h-[500px] pointer-events-none z-0">
        <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path opacity="0.6" d="M300 500C300 500 250 400 400 300C550 200 600 350 700 300C800 250 800 100 800 100V500H300Z" fill="url(#paint0_linear)"/>
          <path opacity="0.8" d="M400 500C400 500 350 350 500 250C650 150 700 250 800 200V500H400Z" fill="url(#paint1_linear)"/>
          <path d="M500 500C500 500 500 400 650 350C800 300 800 250 800 250V500H500Z" fill="#D32F2F"/>
          <defs>
            <linearGradient id="paint0_linear" x1="550" y1="100" x2="550" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9800"/>
              <stop offset="1" stopColor="#D32F2F"/>
            </linearGradient>
            <linearGradient id="paint1_linear" x1="600" y1="150" x2="600" y2="500" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF5722"/>
              <stop offset="1" stopColor="#B71C1C"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Left Sidebar */}
      <div className="w-[300px] shrink-0 bg-[#f6f6f6] h-screen fixed left-0 top-0 flex flex-col items-center py-12 z-10 rounded-r-3xl shadow-[5px_0_15px_rgba(0,0,0,0.03)]">
        {/* Logo */}
        <div className="flex items-center gap-2 text-[#9b3b3b] mb-12">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
          </svg>
          <span className="font-extrabold text-[28px] tracking-tight text-[#333]">adisyo</span>
        </div>

        {/* Progress Circle */}
        <div className="relative w-32 h-32 mb-12">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
              strokeWidth="2"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#d82c2c]"
              strokeWidth="2"
              strokeDasharray={`${currentStep * 33.33}, 100`}
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">{Math.round(currentStep * 33.33)}%</span>
            <span className="text-sm text-gray-500 font-medium">{currentStep}/3</span>
          </div>
        </div>

        {/* Steps List */}
        <div className="w-full px-4 flex flex-col gap-2">
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                currentStep === step.id 
                  ? 'bg-white shadow-sm' 
                  : currentStep > step.id 
                    ? 'opacity-80' 
                    : 'opacity-50'
              }`}
            >
              <span className={`font-semibold text-[15px] ${currentStep === step.id ? 'text-gray-900' : 'text-gray-700'}`}>
                {step.title}
              </span>
              {currentStep > step.id && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white">
                  <Check size={14} strokeWidth={3} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-[300px] flex-1 flex flex-col items-center py-16 px-8 z-10 pb-32">
        <div className="w-full max-w-[850px]">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[26px] font-semibold text-gray-900 mb-3">{steps[currentStep - 1].title}</h1>
            <p className="text-[15px] text-gray-500">
              {currentStep === 1 && 'Sipariş süreçlerinizi hızlandırmak için aşağıdaki bilgilere ihtiyacımız var'}
              {currentStep === 2 && 'Seçtiğiniz çalışma tiplerine göre süreçleri yapılandıralım'}
              {currentStep === 3 && 'Adisyo hesabınız başarıyla yapılandırıldı! Artık işletmenizi yönetmeye başlayabilirsiniz.'}
            </p>
          </div>

          {/* STEP 1 CONTENT */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Info Alert */}
              <div className="bg-[#eaf4fe] text-[#2c77d2] px-4 py-3.5 rounded-lg flex items-center justify-center gap-2 text-[14px] font-medium border border-[#d2e6fc]">
                <Info size={18} />
                Çalışma ve ödeme tiplerini daha sonra Ayarlar ekranından değiştirebilir, ödeme tiplerinin sırasını düzenleyebilirsiniz.
              </div>

              {/* Section 1 */}
              <div>
                <h3 className="text-[14px] font-medium text-gray-600 mb-4">İşletmenizin Çalışma Tipi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Masa Siparişi', 'Paket Sipariş', 'Gel Al Sipariş'].map(type => (
                    <div 
                      key={type}
                      onClick={() => toggleSelection(workTypes, setWorkTypes, type)}
                      className={`flex items-center gap-3 p-5 rounded-lg border cursor-pointer transition-all ${
                        workTypes.includes(type) ? 'border-[#d82c2c] bg-white text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 border ${
                        workTypes.includes(type) ? 'bg-[#d82c2c] border-[#d82c2c] text-white' : 'border-gray-300 bg-transparent'
                      }`}>
                        {workTypes.includes(type) && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="font-semibold text-[14px]">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2 */}
              <div>
                <h3 className="text-[14px] font-medium text-gray-600 mb-4">Kabul Ettiğiniz Ödeme Tipleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Nakit', 'Kredi Kartı', 'Multinet', 'Smart Ticket', 'SetCard', 'Pluxee (Sodexo)', 'Diğer'].map(type => (
                    <div 
                      key={type}
                      onClick={() => toggleSelection(paymentTypes, setPaymentTypes, type)}
                      className={`flex items-center gap-3 p-5 rounded-lg border cursor-pointer transition-all ${
                        paymentTypes.includes(type) ? 'border-[#d82c2c] bg-white text-gray-900 shadow-sm' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-[4px] flex items-center justify-center shrink-0 border ${
                        paymentTypes.includes(type) ? 'bg-[#d82c2c] border-[#d82c2c] text-white' : 'border-gray-300 bg-transparent'
                      }`}>
                        {paymentTypes.includes(type) && <Check size={14} strokeWidth={3} />}
                      </div>
                      <span className="font-semibold text-[14px]">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              <h2 className="font-semibold text-[16px] text-gray-900 mb-1">Gel-Al Sipariş Yönetimi</h2>
              <p className="text-[14px] text-gray-500 mb-2">Deneyiminizi iyileştirelim.</p>

              {/* Box 1 */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#d82c2c] flex items-center justify-center font-bold text-xs">1</div>
                  <h3 className="font-semibold text-[15px] text-gray-900">Siparişleriniz mutfağa nasıl iletiliyor?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Yazıcı ile', desc: 'Mutfak fişi basılıyor' },
                    { title: 'Mutfak Ekranı', desc: 'Mutfak ekranında görülüyor' },
                    { title: 'Her İkisi', desc: 'Hem yazıcı hem mutfak ekranı' }
                  ].map(option => (
                    <div 
                      key={option.title}
                      onClick={() => setKitchenDelivery(option.title)}
                      className={`flex flex-col gap-1 p-5 rounded-lg border cursor-pointer transition-all ${
                        kitchenDelivery === option.title ? 'border-[#d82c2c] bg-red-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="font-semibold text-[14px] text-gray-900">{option.title}</span>
                      <span className="text-[13px] text-gray-500">{option.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 2 */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#d82c2c] flex items-center justify-center font-bold text-xs">2</div>
                  <h3 className="font-semibold text-[15px] text-gray-900">Ödeme genellikle ne zaman alınıyor?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Sipariş Alınırken', desc: 'Peşin / Hemen' },
                    { title: 'Teslimde', desc: 'Müşteri, ürünü teslim alırken' },
                    { title: 'Karışık', desc: 'Bazı müşterilerden önden, Bazılarından sonra' }
                  ].map(option => (
                    <div 
                      key={option.title}
                      onClick={() => setPaymentTime(option.title)}
                      className={`flex flex-col gap-1 p-5 rounded-lg border cursor-pointer transition-all ${
                        paymentTime === option.title ? 'border-[#d82c2c] bg-red-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="font-semibold text-[14px] text-gray-900">{option.title}</span>
                      <span className="text-[13px] text-gray-500">{option.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 rounded-full bg-red-50 text-[#d82c2c] flex items-center justify-center font-bold text-xs">3</div>
                  <h3 className="font-semibold text-[15px] text-gray-900">Müşteriye fiş veriliyor mu?</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: 'Evet', desc: 'Her zaman' },
                    { title: 'Hayır', desc: 'Gerekmiyor' },
                    { title: 'Opsiyonel', desc: 'Sadece Müşteri İsterse' }
                  ].map(option => (
                    <div 
                      key={option.title}
                      onClick={() => setReceiptGiven(option.title)}
                      className={`flex flex-col gap-1 p-5 rounded-lg border cursor-pointer transition-all ${
                        receiptGiven === option.title ? 'border-[#d82c2c] bg-red-50/30' : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <span className="font-semibold text-[14px] text-gray-900">{option.title}</span>
                      <span className="text-[13px] text-gray-500">{option.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Form Fields */}
              <div className="mt-4">
                <h3 className="text-[14px] font-medium text-gray-600 mb-2">İşletme Tipi</h3>
                <div className="relative w-full">
                  <select 
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-300 focus:border-[#d82c2c] rounded-lg px-4 py-3.5 text-[14px] text-gray-900 outline-none cursor-pointer"
                  >
                    <option value="Cafe">Cafe</option>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Fast Food">Fast Food</option>
                    <option value="Bar">Bar</option>
                    <option value="Otel İçi Cafe-Restaurant">Otel İçi Cafe-Restaurant</option>
                    <option value="Diğer">Diğer</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[14px] font-medium text-gray-600 mb-2">İşletmenizin Bulunduğu Ülke</h3>
                  <div className="relative w-full">
                    <select className="w-full appearance-none bg-white border border-gray-300 focus:border-[#d82c2c] rounded-lg px-4 py-3.5 text-[14px] text-gray-900 outline-none cursor-pointer">
                      <option>Türkiye</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-gray-600 mb-2">İşletmenizin Bulunduğu Şehir</h3>
                  <div className="relative w-full">
                    <select className="w-full appearance-none bg-white border border-gray-300 focus:border-[#d82c2c] rounded-lg px-4 py-3.5 text-[14px] text-gray-900 outline-none cursor-pointer">
                      <option>Şehir Adı</option>
                      <option>İstanbul</option>
                      <option>Ankara</option>
                      <option>İzmir</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-[14px] font-medium text-gray-600 mb-2">Gün Başlangıç Saati</h3>
                  <input type="time" defaultValue="06:00" className="w-full bg-white border border-gray-300 focus:border-[#d82c2c] rounded-lg px-4 py-3.5 text-[14px] text-gray-900 outline-none" />
                </div>
                <div>
                  <h3 className="text-[14px] font-medium text-gray-600 mb-2">Gün Bitiş Saati</h3>
                  <input type="time" defaultValue="23:45" className="w-full bg-white border border-gray-300 focus:border-[#d82c2c] rounded-lg px-4 py-3.5 text-[14px] text-gray-900 outline-none" />
                </div>
              </div>

            </div>
          )}

          {/* STEP 3 CONTENT */}
          {currentStep === 3 && (
            <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6 shadow-sm">
                <Check size={48} strokeWidth={2.5} />
              </div>
              <h2 className="text-[24px] font-bold text-gray-900 mb-2">Her Şey Hazır!</h2>
              <p className="text-gray-500 text-center max-w-md mb-8">
                Tebrikler, temel işletme ayarlarınızı tamamladınız. Artık menünüzü oluşturmaya ve sipariş almaya başlayabilirsiniz.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-12">
            {currentStep > 1 && currentStep < 3 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-10 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-colors text-[15px]"
              >
                Geri Dön
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-10 py-3 bg-[#db3333] hover:bg-[#c22828] text-white font-medium rounded-full transition-colors shadow-sm text-[15px]"
              >
                Devam Et
              </button>
            ) : (
              <button 
                onClick={() => router.push('/')}
                className="px-10 py-3 bg-[#db3333] hover:bg-[#c22828] text-white font-medium rounded-full transition-colors shadow-sm text-[15px]"
              >
                Adisyo'ya Git
              </button>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
