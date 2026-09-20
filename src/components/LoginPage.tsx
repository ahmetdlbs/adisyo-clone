"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, Headphones } from "lucide-react";
import AdisyoLogo from "./AdisyoLogo";

interface LoginPageProps {
  onLoginSuccess: (userEmail: string) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("softdeap@gmail.com");
  const [password, setPassword] = useState("Depsoft@12345");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(email);
    }, 400);
  };

  return (
    <div className="flex h-screen w-screen bg-[#f8f9fa] overflow-hidden select-none">
      {/* Left Column: Authentic Hero Testimonial Panel (~26% width) */}
      <div className="hidden lg:flex lg:w-[26%] xl:w-[25%] relative flex-col justify-end p-8 xl:p-10 text-white overflow-hidden shrink-0">
        {/* Wood-fired oven hero image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/login-hero.jpg"
            alt="Adisyo Restoran"
            fill
            className="object-cover"
            priority
          />
          {/* Authentic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        </div>

        {/* Quote Content */}
        <div className="relative z-10 space-y-4">
          <div className="text-6xl font-serif text-white/95 leading-none select-none">
            “
          </div>

          <p className="text-[13px] xl:text-[14px] leading-relaxed font-normal text-white/95">
            Çok şubeli yapımızda en önemli konu, tüm operasyonu merkezden sağlıklı ve anlık şekilde yönetebilmek.
            Adisyo sayesinde şubelerimizin verilerine tek panel üzerinden anında ulaşabiliyoruz.
            Raporlamalarımız artık net, şeffaf ve karşılaştırılabilir. Karar alma süreçlerimiz hızlandı, operasyonel kontrolümüz güçlendi.
          </p>

          <div className="pt-4 border-t border-white/30">
            <div className="flex items-center gap-3">
              {/* Pasaport Pizza Circular Badge */}
              <div className="w-10 h-10 rounded-full bg-[#c02328] border-2 border-white/90 flex items-center justify-center p-1 shadow-md shrink-0">
                <span className="text-[9px] font-black text-yellow-300 text-center leading-tight uppercase">
                  Pasaport<br />Pizza
                </span>
              </div>
              <span className="text-sm font-semibold text-white">
                Pasaport Pizza
              </span>
            </div>

            {/* Pagination Dash indicators */}
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-1 rounded-full bg-white" />
              <div className="w-2 h-1 rounded-full bg-white/40" />
              <div className="w-2 h-1 rounded-full bg-white/40" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Exact Adisyo Login Screen (~74% width) */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-10 bg-[#f8f9fa] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between w-full">
          <AdisyoLogo size="lg" />

          {/* Destek İste Capsule Button */}
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-medium text-[#4b5563] bg-white border border-[#d1d5db] rounded-full hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-[#4b5563]" />
            <span>Destek İste</span>
          </button>
        </div>

        {/* Centered Login Card */}
        <div className="w-full max-w-[400px] mx-auto my-auto">
          <div className="mb-6">
            <h1 className="text-[22px] md:text-[24px] font-semibold text-[#262626]">
              Adisyo&apos;ya hoş geldiniz
            </h1>
            <p className="text-[13px] text-[#757575] mt-1.5">
              Lütfen üyelik bilgileriniz ile giriş yapınız
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input 1: E-Posta / Telefon */}
            <div>
              <input
                id="login-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-Posta Adresi veya Telefon Numarası"
                className="w-full h-12 px-3.5 text-[14px] text-[#262626] placeholder-[#8e8e8e] bg-white border border-[#d9d9d9] rounded-[4px] outline-none focus:border-[#b84a43] focus:ring-1 focus:ring-[#b84a43] transition-all"
                required
              />
            </div>

            {/* Input 2: Şifre */}
            <div>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Şifre"
                  className="w-full h-12 px-3.5 pr-10 text-[14px] text-[#262626] placeholder-[#8e8e8e] bg-white border border-[#d9d9d9] rounded-[4px] outline-none focus:border-[#b84a43] focus:ring-1 focus:ring-[#b84a43] transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#757575] hover:text-[#262626] cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Şifremi Unuttum */}
              <div className="flex justify-end mt-2">
                <span className="text-[13px] text-[#757575] hover:text-[#262626] cursor-pointer">
                  Şifremi Unuttum
                </span>
              </div>
            </div>

            {/* Giriş Yap Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-[#b84a43] hover:bg-[#a53f38] active:bg-[#923630] text-white font-medium text-[15px] rounded-[4px] shadow-2xs transition-colors flex items-center justify-center cursor-pointer mt-3"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Giriş Yap"
              )}
            </button>
          </form>

          {/* Footer: Şimdi Kaydolun */}
          <div className="text-center mt-6 text-[13px] text-[#757575]">
            Üye Değil Misiniz?{" "}
            <span className="font-semibold text-[#b84a43] hover:underline cursor-pointer">
              Şimdi Kaydolun
            </span>
          </div>
        </div>

        {/* Bottom empty spacer to match Adisyo layout */}
        <div className="h-4" />
      </div>
    </div>
  );
}
