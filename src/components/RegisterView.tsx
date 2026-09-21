"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RegisterView() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <div className={`flex min-h-screen ${inter.className}`}>
      
      {/* Left Panel: Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-[#f4ead2] relative">
        <Image
          src="/images/register-hero.jpg"
          alt="Adisyo Online Orders"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Right Panel: Registration Form */}
      <div className="w-full lg:w-1/2 bg-[#f5f6f8] flex flex-col items-center py-8 relative px-6 sm:px-12">
        
        {/* Top Header */}
        <div className="w-full flex justify-between items-center mb-10 max-w-lg">
          <div className="flex items-center gap-2 text-[#9b3b3b]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
            <span className="font-bold text-[24px] tracking-tight">adisyo</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9b3b3b]">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Destek İste
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px] flex-1 flex flex-col mt-4">
          
          <h1 className="text-[26px] font-semibold text-gray-900 mb-2">Adisyo'ya hoş geldiniz</h1>
          <p className="text-[14px] text-gray-500 mb-8">Hemen kaydolun, 15 Gün boyunca ücretsiz deneyin!</p>
          
          <form className="flex flex-col gap-4">
            
            <div className="w-full">
              <input 
                type="text" 
                placeholder="Restoran Adı" 
                className="w-full px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="w-full">
              <input 
                type="text" 
                placeholder="İsim Soyisim" 
                className="w-full px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="w-full">
              <input 
                type="email" 
                placeholder="Güncel Mail Adresiniz" 
                className="w-full px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400"
              />
            </div>
            
            <div className="flex gap-2 w-full">
              <div className="relative w-[110px] shrink-0 border border-gray-300 rounded-md bg-transparent">
                <select className="w-full h-full px-4 py-3.5 appearance-none bg-transparent outline-none text-[14px] text-gray-800 cursor-pointer pr-8">
                  <option value="+90">+90</option>
                  <option value="+1">+1</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
              <input 
                type="tel" 
                placeholder="Cep Telefonu" 
                className="flex-1 px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400"
              />
            </div>

            <div className="relative w-full">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Şifre" 
                className="w-full px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400 pr-12"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <div className="relative w-full">
              <input 
                type={showPasswordConfirm ? "text" : "password"} 
                placeholder="Şifre Tekrar" 
                className="w-full px-4 py-3.5 bg-transparent border border-gray-300 rounded-md focus:border-gray-500 focus:outline-none transition-colors text-[14px] text-gray-800 placeholder-gray-400 pr-12"
              />
              <button 
                type="button" 
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 mt-2 mb-2">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="w-4 h-4 rounded border-gray-300 text-[#9b3b3b] focus:ring-[#9b3b3b] cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-[13px] text-gray-800 leading-tight cursor-pointer">
                <Link href="#" className="font-semibold underline underline-offset-2">Kullanım Sözleşmesini</Link> ve <Link href="#" className="font-semibold underline underline-offset-2">Aydınlatma Metnini</Link> okudum kabul ediyorum.
              </label>
            </div>

            <button 
              type="button"
              onClick={() => router.push('/onboarding')} 
              className="w-full bg-[#9b3b3b] hover:bg-[#853030] text-white font-medium py-3.5 rounded-md transition-colors shadow-sm text-[15px] mt-2"
            >
              Kayıt Ol
            </button>

          </form>
          
          <div className="mt-8 text-center pb-8">
            <p className="text-[13px] text-gray-600">
              Üye Misiniz? <Link href="/login" className="font-bold text-[#9b3b3b] hover:underline">Giriş Yap</Link>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
